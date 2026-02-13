const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: {
        type: String,
        enum: ['Passport', 'Transcript', 'EnglishTest', 'SOP', 'Resume', 'BankStatement', 'GRE_SAT', 'DegreeCertificate'],
        required: true
    },
    filePath: { type: String, required: true },
    extractedData: { type: Object },
    isValid: { type: Boolean, default: false },
    validationMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
