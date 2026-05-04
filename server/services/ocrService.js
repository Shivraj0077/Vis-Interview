const tesseract = require('tesseract.js');
const { parseDocument } = require('./geminiService');
const extractTextFromImage = async (filePath) => {
    try {
        const { data: { text, confidence } } = await tesseract.recognize(filePath, 'eng');
        return { text, confidence };
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from document');
    }
};

/**
 * Validates the document specific logic (Checksums, dates, etc.)
 */
const validateDocumentLogic = async (data, type) => {
    const flags = [];
    
    if (type === 'Passport' && data.mrzLine) {
        try {
            const mrzLib = await import('mrz');
            const mrz = mrzLib.default || mrzLib;
            // Very simple MRZ check for demo
            const result = mrz.parse(data.mrzLine.split('\n'));
            if (!result.valid) {
                flags.push("MRZ Checksum failure: Document may be fabricated.");
            }
        } catch (e) {
            flags.push("Invalid MRZ format detected.");
        }
    }

    if (type === 'Form I-20') {
        const sevisRegex = /^N\d{10}$/;
        if (data.sevisID && !sevisRegex.test(data.sevisID)) {
            flags.push("Invalid SEVIS ID format. Expected N + 10 digits.");
        }
        if (data.programStartDate && data.programEndDate) {
            if (new Date(data.programEndDate) <= new Date(data.programStartDate)) {
                flags.push("Logical Error: Program end date must be after start date.");
            }
        }
    }

    if (type === 'Bank Statement') {
        if (data.currentBalance < 10000) {
            flags.push("Insufficient Funds: Balance appears lower than typical cost of attendance.");
        }
    }

    return flags;
};

module.exports = { extractTextFromImage, parseDocument, validateDocumentLogic };
