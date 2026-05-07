const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    type: {
        type: String,
        enum: ['Passport', 'I-20', 'Bank Statement', 'Offer Letter', 'Statement of Purpose', 'Passport Photo', 'Resume', 'DS-160', 'Unknown'],
        required: true
    },
    filePath: { type: String, required: true },
    extractedData: { type: Object },
    ocrConfidence: { type: Number },
    validationFlags: [{ type: String }],
    isValid: { type: Boolean, default: false },
    validationMessage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
