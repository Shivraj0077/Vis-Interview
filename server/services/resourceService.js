const axios = require('axios');
const { client: redis } = require('../config/redis');

const getJobs = async (city = 'New York') => {
    try {
        const cacheKey = `jobs:${city.toLowerCase()}`;
        const cachedJobs = await redis.get(cacheKey);
        if (cachedJobs) {
            console.log('⚡ Serving jobs from Redis');
            return JSON.parse(cachedJobs);
        }

        // Adzuna API
        const ADZUNA_ID = process.env.ADZUNA_APP_ID;
        const ADZUNA_KEY = process.env.ADZUNA_APP_KEY;
        
        let adzunaJobs = [];
        if (ADZUNA_ID && ADZUNA_KEY) {
            const response = await axios.get(`https://api.adzuna.com/v1/api/jobs/us/search/1`, {
                params: {
                    app_id: ADZUNA_ID,
                    app_key: ADZUNA_KEY,
                    what: 'part time student',
                    where: city || 'New York'
                }
            });
            adzunaJobs = response.data.results.map(j => ({
                title: j.title,
                company: j.company.display_name,
                location: j.location.display_name,
                salary: j.salary_min ? `$${j.salary_min} - $${j.salary_max}` : 'Salary not disclosed',
                link: j.redirect_url
            }));

            // Cache for 1 hour
            await redis.setEx(cacheKey, 3600, JSON.stringify(adzunaJobs.slice(0, 10)));
        }

        return adzunaJobs.slice(0, 10);
    } catch (err) {
        console.error('Job search failed:', err.message);
        return [];
    }
};

const getLegalHelp = async () => {
    // Static list of major immigration nonprofits for demo reliability
    return [
        {
            name: "American Immigration Council",
            location: "Washington, DC",
            phone: "(202) 507-7500",
            specialization: "Policy & Litigation",
            link: "https://www.americanimmigrationcouncil.org/"
        },
        {
            name: "National Immigration Law Center (NILC)",
            location: "Los Angeles, CA",
            phone: "(213) 639-3900",
            specialization: "Low-income immigrant rights",
            link: "https://www.nilc.org/"
        },
        {
            name: "Immigrant Legal Resource Center (ILRC)",
            location: "San Francisco, CA",
            phone: "(415) 255-9499",
            specialization: "Training & Legal expertise",
            link: "https://www.ilrc.org/"
        }
    ];
};

module.exports = { getJobs, getLegalHelp };
