const { client: redis } = require('../config/redis');

let aiInstance = null;
async function getAI() {
    if (!aiInstance) {
        const { GoogleGenAI } = await import("@google/genai");
        aiInstance = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY
        });
    }
    return aiInstance;
}

const generateNextQuestion = async (student, interview, docs) => {
    try {
        const docData = docs.map(d => ({
            type: d.type,
            data: d.extractedData
        }));

        const backgroundData = student.backgroundHits;

        const phases = {
            1: "Identity & Background (Comparing verbal answers to document data)",
            2: "Intent & Purpose (Detecting non-immigrant intent red flags)",
            3: "Document Deep-Dive (Technical specifics from I-20 and Bank Statements)",
            4: "Background & Risk (Addressing any findings or standard criminal checks)",
            5: "Closing (Clarification and final thoughts)"
        };

        const prompt = `
      You are a US Visa pre-screening officer for F-1 student visas.
      
      STUDENT DATA:
      Name: ${student.fullName}
      Nationality: ${student.nationality}
      
      DOCUMENTS:
      ${JSON.stringify(docData)}

      BACKGROUND HITS:
      ${JSON.stringify(backgroundData)}

      CURRENT PHASE: ${phases[interview.currentPhase]}
      
      INTERVIEW HISTORY:
      ${interview.questions.map(q => `Q: ${q.question}\nA: ${q.answerText}`).join('\n')}

      INSTRUCTIONS:
      1. Generate the single most relevant next question for the current phase.
      2. If current phase is 3, pick a specific field from their I-20 or Bank Statement to verify.
      3. If phase 4 and there are background hits, ask about them politely but firmly.
      4. Evaluation: Evaluate the last answer if provided.
      
      Return JSON:
      {
        "nextQuestion": "string",
        "evaluation": {
            "consistency": number (0-10),
            "specificity": number (0-10),
            "red_flags": ["string"],
            "notes": "string"
        },
        "advancePhase": boolean
      }
    `;

        const cacheKey = `interview:q:${student._id}:${interview.currentPhase}:${interview.questions.length}`;
        const cachedQ = await redis.get(cacheKey);
        if (cachedQ) {
            console.log('⚡ Serving question from Redis');
            return JSON.parse(cachedQ);
        }

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            // Cache for 10 minutes
            await redis.setEx(cacheKey, 600, JSON.stringify(result));
            return result;
        }
        return { 
            nextQuestion: "Can you tell me more about your plans after graduation?", 
            evaluation: { consistency: 10, specificity: 10, red_flags: [], notes: "Default" },
            advancePhase: false
        };
    } catch (err) {
        console.error('Interview Question Generation Error:', err);
        return { 
            nextQuestion: "Why did you choose this specific university?", 
            evaluation: { consistency: 8, specificity: 8, red_flags: [], notes: "Fallback" },
            advancePhase: false
        };
    }
};

module.exports = { generateNextQuestion };
