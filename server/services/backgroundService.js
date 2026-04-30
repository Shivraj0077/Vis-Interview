const axios = require('axios');
const cheerio = require('cheerio');
const { analyzeNewsHit } = require('./geminiService');

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const SERP_API_KEY = process.env.SERP_API_KEY;

const checkSanctions = async (name, dob) => {
    try {
        const response = await axios.post('https://api.opensanctions.org/match/default', {
            queries: {
                q1: {
                    schema: 'Person',
                    properties: {
                        name: [name],
                        birthDate: [dob]
                    }
                }
            }
        });

        const matches = response.data?.responses?.q1?.results || [];
        return matches.filter(m => m.score > 0.7).map(m => ({
            source: 'OpenSanctions',
            description: `Sanctions match found: ${m.caption}`,
            severity: 'Critical',
            link: `https://www.opensanctions.org/entities/${m.id}`
        }));
    } catch (err) {
        console.error('OpenSanctions check failed:', err.message);
        return [];
    }
};

const checkInterpol = async (name) => {
    try {
        // Mocking Interpol scrape as real scraping is fragile in a dev environment
        // In a real prod app, you'd use a headless browser or a dedicated API
        const [firstName, ...lastNames] = name.split(' ');
        const url = `https://ws-public.interpol.int/notices/v1/red?forename=${firstName}&name=${lastNames.join(' ')}`;
        const response = await axios.get(url);
        
        if (response.data?.total > 0) {
            return [{
                source: 'INTERPOL',
                description: `INTERPOL Red Notice match found for ${name}`,
                severity: 'Critical',
                link: 'https://www.interpol.int/How-we-work/Notices/Red-Notices'
            }];
        }
        return [];
    } catch (err) {
        console.error('Interpol check failed:', err.message);
        return [];
    }
};

const checkNews = async (name) => {
    try {
        const query = `"${name}" crime OR fraud OR arrested OR convicted OR deported`;
        const response = await axios.get(`https://newsapi.org/v2/everything`, {
            params: {
                q: query,
                language: 'en',
                sortBy: 'relevance',
                apiKey: NEWS_API_KEY
            }
        });

        const articles = response.data.articles || [];
        const hits = [];

        for (const article of articles.slice(0, 3)) {
            const isRelevant = await analyzeNewsHit(name, article.title, article.description);
            if (isRelevant) {
                hits.push({
                    source: article.source.name || 'News',
                    description: article.title,
                    severity: 'Warning',
                    link: article.url
                });
            }
        }
        return hits;
    } catch (err) {
        console.error('News check failed:', err.message);
        return [];
    }
};

const performFullBackgroundCheck = async (student) => {
    const hits = [];
    
    const sanctionHits = await checkSanctions(student.fullName, student.dob.toISOString().split('T')[0]);
    hits.push(...sanctionHits);

    const interpolHits = await checkInterpol(student.fullName);
    hits.push(...interpolHits);

    const newsHits = await checkNews(student.fullName);
    hits.push(...newsHits);

    // Scoring logic
    let score = 25;
    const criticalCount = hits.filter(h => h.severity === 'Critical').length;
    const warningCount = hits.filter(h => h.severity === 'Warning').length;

    if (criticalCount > 0) score = 0;
    else if (warningCount >= 2) score = 12;
    else if (warningCount === 1) score = 18;

    return { hits, score };
};

module.exports = { performFullBackgroundCheck };
