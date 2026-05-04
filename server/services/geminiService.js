const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

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

/**
 * Transcribe audio using ElevenLabs Scribe API (External STT Provider)
 */
const transcribeAudio = async (filePath) => {
    try {
        let fileContent;
        if (filePath.startsWith('http')) {
            const response = await axios.get(filePath, { responseType: 'arraybuffer' });
            fileContent = Buffer.from(response.data);
        } else {
            if (!fs.existsSync(filePath)) return "Audio file missing.";
            fileContent = fs.readFileSync(filePath);
        }

        // Attempt Gemini transcription first (Multimodal)
        const geminiTrans = await transcribeAudioWithGemini(fileContent);
        if (geminiTrans) return geminiTrans;

        // Fallback to ElevenLabs Scribe
        const formData = new FormData();
        formData.append('file', fileContent, { filename: 'audio.webm' });
        formData.append('model_id', 'scribe_v1');

        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
            headers: {
                ...formData.getHeaders(),
                'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
            },
        });

        return response.data.text;
    } catch (error) {
        console.error('Audio Transcription Error:', error.message);
        return "Transcription failed. Please repeat your answer.";
    }
};

const transcribeAudioWithGemini = async (fileContentOrPath) => {
    try {
        let fileContent = fileContentOrPath;
        if (typeof fileContentOrPath === 'string') {
            fileContent = fs.readFileSync(fileContentOrPath);
        }

        const ai = await getAI();
        const result = await ai.models.generateContent({
            model: "gemini-1.5-flash", // Use 1.5 flash for audio
            contents: [
                {
                    inlineData: {
                        mimeType: "audio/webm",
                        data: fileContent.toString("base64")
                    }
                },
                { text: "Transcribe this audio clip exactly. Return only the transcript." }
            ]
        });
        return result.text;
    } catch (err) {
        console.error('Gemini audio transcription failed:', err.message);
        return null;
    }
};

/**
 * High-level analysis of the full interview transcript using Gemini 3 Flash Preview
 */
const analyzeTranscript = async (transcript) => {
    try {
        const prompt = `
      You are a senior US Visa Interview Officer. Analyze this student visa interview transcript and evaluate STRICTLY.
      
      SCORING RUBRIC (Strict):
      - 90-100: Exceptional details, naming specific universities, courses, professors, exact financial figures, and logical return plans.
      - 70-89: Good details but missing some specifics or slightly less polished reasoning.
      - 40-69: Vague or generic answers (e.g., "I want a better life", "my parents will pay").
      - 0-39: Contradictory, suspicious, or extremely brief responses.

      EVALUATION CRITERIA:
      1. Academic Intent Clarity (0-100): Does the candidate name specific courses, labs, or professors? Is the university choice justified beyond rankings?
      2. Financial Understanding (0-100): Does the candidate provide a specific cost breakdown and proof of funding? (e.g., specific liquid assets, sponsor income).
      3. Post-Graduation Plans (0-100): Clear return intention with logic tied to the home country's market/industry.
      4. Overall Credibility (0-100): Confidence, consistency, and logical flow between past experience and future goals.

      Transcript:
      "${transcript}"

      Return ONLY a valid JSON object:
      {
        "academicIntentScore": number,
        "financialUnderstandingScore": number,
        "postGradScore": number,
        "overallCredibilityScore": number,
        "redFlags": ["string"],
        "summary": "string max 50 words"
      }
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Invalid AI JSON response");
    } catch (error) {
        console.error('Gemini Transcript Analysis Error:', error);
        return {
            academicIntentScore: 50,
            financialUnderstandingScore: 50,
            postGradScore: 50,
            overallCredibilityScore: 50,
            redFlags: ["Analysis technical failure"],
            summary: "Error processing transcript logic."
        };
    }
};

/**
 * Real-time feedback for a single question using Gemini 3 Flash Preview
 */
const analyzeSingleAnswer = async (question, answer) => {
    try {
        const prompt = `
      Evaluate this student's answer as a strict US Visa Officer.
      
      STRICT SCORING PATTERNS:
      - 90+: Specificity (names, numbers, dates), logical progression (past -> future), research demonstrated (mentions courses/profs).
      - <60: Vague, generic, or non-specific answers.

      Q: "${question}"
      A: "${answer}"

      Return JSON:
      {
        "score": number (0-100),
        "feedback": "string max 20 words"
      }
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return { score: 60, feedback: "Good answer." };
    } catch (error) {
        console.error('Gemini Single Answer Error:', error);
        return { score: 50, feedback: "Keep going." };
    }
};

/**
 * Structured document parsing using Gemini 3 Flash Preview
 */
const parseDocument = async (rawText, docType) => {
    try {
        const prompt = `
      You are a high-accuracy OCR parsing engine. Extract the following fields from this ${docType} raw text as a clean JSON object. 
      If a field is not found, use null.
      
      FIELDS TO EXTRACT PER DOCUMENT TYPE:
      - Form I-20: studentName, sevisID, programStartDate, programEndDate, schoolName, pdsoName, estimatedCost (number), fieldOfStudy
      - Passport: fullName, dob, nationality, issueDate, expiryDate, mrzLine (the bottom lines)
      - Bank Statement: accountHolderName, accountNumber, currentBalance (number), currency, threeMonthAverage (number)
      - Offer Letter: universityName, programName, intakeSemester, scholarshipAmount (number), studentName
      - SOP: careerGoal, programMentioned, homeCountryPlan, universityMentioned

      Raw OCR Text:
      "${rawText}"

      Return ONLY valid JSON.
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("Could not parse OCR JSON");
    } catch (error) {
        console.error('Gemini Document Parse Error:', error);
        return {};
    }
};

const analyzeNewsHit = async (name, title, snippet) => {
    try {
        const prompt = `
      You are an OSINT investigator. Determine if this news article headline and snippet are highly likely to be about a person named "${name}" in a negative legal or criminal sense.
      
      Article Title: "${title}"
      Snippet: "${snippet}"

      CRITERIA:
      - Is it about a crime, fraud, arrest, deportation, or legal trouble?
      - Does the name match or strongly correspond?
      
      Return ONLY a JSON object:
      {
        "isRelevant": boolean,
        "reason": "short explanation"
      }
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return result.isRelevant;
        }
        return false;
    } catch (error) {
        console.error('Gemini News Analysis Error:', error);
        return false;
    }
};

const generateFinalRecommendations = async (student, docs) => {
    try {
        const prompt = `
      You are a specialized US Student Visa Consultant. Based on the following application metrics, generate 3-4 specific, actionable recommendations for the student to improve their chances in a real visa interview.

      APPLICATION METRICS:
      - Score: ${student.finalScore}/100
      - Background Hits: ${JSON.stringify(student.backgroundHits)}
      - Documents: ${JSON.stringify(docs.map(d => ({ type: d.type, valid: d.isValid, flags: d.validationFlags })))}

      Return a JSON array of strings (recommendations).
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return ["Ensure all documents are updated.", "Practice your interview answers more."];
    } catch (err) {
        console.error('Gemini Recommendation Error:', err);
        return [];
    }
};

/**
 * Holistic analysis of all documents together
 */
const analyzeHolistically = async (student, docs) => {
    try {
        const docSummary = docs.map(d => ({
            type: d.type,
            data: d.extractedData,
            flags: d.validationFlags
        }));

        const prompt = `
      You are a Senior US Visa Verification Officer. Perform a HOLISTIC review of this entire application.
      
      STUDENT PROFILE:
      Name: ${student.fullName}
      Nationality: ${student.nationality}
      Risk Level So Far: ${student.riskLevel}
      
      DOCUMENTS DATA:
      ${JSON.stringify(docSummary)}
      
      INSTRUCTIONS:
      1. Cross-reference all dates, names, and financial figures.
      2. Look for "Non-Immigrant Intent" issues.
      3. Identify any logical gaps (e.g., student is 30 but applying for a Bachelor's with no work history).
      4. Provide a final credibility assessment.

      Return JSON:
      {
        "holisticScore": number (0-100),
        "deepInsights": ["string"],
        "criticalContradictions": ["string"],
        "finalVerdict": "string"
      }
    `;

        const ai = await getAI();
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt
        });

        const text = response.text.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { holisticScore: 70, deepInsights: [], criticalContradictions: [], finalVerdict: "Review complete." };
    } catch (err) {
        console.error('Holistic Analysis Error:', err);
        return null;
    }
};

module.exports = { analyzeTranscript, analyzeSingleAnswer, transcribeAudio, parseDocument, analyzeNewsHit, generateFinalRecommendations, analyzeHolistically };
