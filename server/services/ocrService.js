const tesseract = require('tesseract.js');
const fs = require('fs');

const extractTextFromImage = async (filePath) => {
    try {
        const { data: { text } } = await tesseract.recognize(filePath, 'eng');
        return text;
    } catch (error) {
        console.error('OCR Error:', error);
        throw new Error('Failed to extract text from document');
    }
};

const parseDocumentData = (text, type) => {
    const data = { rawText: text.substring(0, 500) }; // Keep excerpt

    // Normalize text for easier matching
    const normText = text.toLowerCase();

    // 1. Extract Name (Common across all)
    const nameMatch = text.match(/name[:\s]+([a-z\s]+)/i);
    if (nameMatch) data.studentName = nameMatch[1].trim();

    // 2. Extract specific fields based on type
    if (type === 'Passport') {
        const dobMatch = text.match(/dob[:\s]+(\d{2}\/\d{2}\/\d{4})/i) || text.match(/birth[:\s]+(\d{2}\/\d{2}\/\d{4})/i);
        if (dobMatch) data.dob = dobMatch[1];
        const passportMatch = text.match(/[a-z][0-9]{7}/i);
        if (passportMatch) data.passportNumber = passportMatch[0];
    }
    else if (type === 'Bank Statement') {
        const balanceMatch = text.match(/balance[:\s]*\$?([0-9,.]+)/i) || text.match(/total[:\s]*\$?([0-9,.]+)/i);
        if (balanceMatch) data.balance = parseFloat(balanceMatch[1].replace(/,/g, ''));
    }
    else if (type === 'English Test Score') {
        const ieltsMatch = text.match(/overall\s*band[：\s]*([0-9.]+)/i);
        const toeflMatch = text.match(/total\s*score[：\s]*([0-9]+)/i);
        if (ieltsMatch) {
            data.testType = 'IELTS';
            data.score = parseFloat(ieltsMatch[1]);
        } else if (toeflMatch) {
            data.testType = 'TOEFL';
            data.score = parseFloat(toeflMatch[1]);
        }
    }
    else if (type === 'Academic Transcript') {
        const gpaMatch = text.match(/gpa[：\s]*([0-9.]+)/i) || text.match(/cgpa[：\s]*([0-9.]+)/i);
        if (gpaMatch) data.score = parseFloat(gpaMatch[1]);
        const instMatch = text.match(/university[:\s]+([a-z\s]+)/i) || text.match(/college[:\s]+([a-z\s]+)/i);
        if (instMatch) data.institution = instMatch[1].trim();
    }

    return data;
};

module.exports = { extractTextFromImage, parseDocumentData };
