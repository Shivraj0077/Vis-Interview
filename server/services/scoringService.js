// Scoring Engine Logic

const calculateFinalScore = (docScore, interviewScore, backgroundScore) => {
    // Weights: Doc (30%), Interview (40%), Background (30%)
    const finalScore = (docScore * 0.3) + (interviewScore * 0.4) + (backgroundScore * 0.3);
    return Math.round(finalScore);
};

const determineRiskLevel = (score) => {
    if (score >= 80) return 'Low';
    if (score >= 50) return 'Medium';
    return 'High';
};

module.exports = { calculateFinalScore, determineRiskLevel };
