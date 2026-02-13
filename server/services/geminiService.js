const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");

// Initialize Google GenAI with the new Flash 3 Preview model
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

/**
 * Transcribe audio using ElevenLabs Scribe API (External STT Provider)
 */
const transcribeAudio = async (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            console.error('Audio file not found at path:', filePath);
            return "Audio file missing.";
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('model_id', 'scribe_v1'); // ElevenLabs Scribe model

        console.log(`Transcribing audio with ElevenLabs: ${filePath}`);

        const response = await axios.post('https://api.elevenlabs.io/v1/speech-to-text', formData, {
            headers: {
                ...formData.getHeaders(),
                'xi-api-key': process.env.ELEVEN_LABS_API_KEY,
            },
        });

        const transcription = response.data.text;
        console.log('ElevenLabs Transcription success:', transcription);
        return transcription;
    } catch (error) {
        console.error('ElevenLabs STT Error:', error.response?.data || error.message);
        return "Speech detection failed. Please try again or type your answer.";
    }
};

/**
 * High-level analysis of the full interview transcript using Gemini 3 Flash Preview
 */
const analyzeTranscript = async (transcript) => {
    try {
        const prompt = `
      You are a senior US Visa Interview Officer. Analyze this student visa interview transcript and evaluate:

      1. Academic Intent Clarity (0-100)
         - Clear educational goals, logical course selection, knowledge about field.
      2. Financial Understanding (0-100)
         - Awareness of costs, clear funding plan, realistic expectations.
      3. Post-Graduation Plans (0-100)
         - Career clarity, return intentions or realistic plans.
      4. Overall Credibility (0-100)
         - Consistency, confidence (from text), logical flow.

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
      Evaluate this student's answer as a US Visa Officer.
      Q: "${question}"
      A: "${answer}"

      Return JSON:
      {
        "score": number (0-100),
        "feedback": "string max 20 words"
      }
    `;

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

module.exports = { analyzeTranscript, analyzeSingleAnswer, transcribeAudio };
