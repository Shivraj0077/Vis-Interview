// Mock Background Check Service

const performBackgroundCheck = async (name) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const flaggedNames = ['John Doe', 'Jane Smith', 'Test User']; // Example flagged names

    if (flaggedNames.includes(name)) {
        return {
            riskScore: 30,
            flags: ['Name match in mock database', 'Suspicious activity reported'],
            status: 'Flagged'
        };
    }

    return {
        riskScore: 95,
        flags: [],
        status: 'Clear'
    };
};

module.exports = { performBackgroundCheck };
