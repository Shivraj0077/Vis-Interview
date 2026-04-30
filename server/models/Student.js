const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    fullName: { type: String },
    passportNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    nationality: { type: String },
    documentsUploaded: { type: Number, default: 0 },
    backgroundScore: { type: Number, default: 0 },
    backgroundHits: [{
        source: String,
        description: String,
        severity: { type: String, enum: ['Info', 'Warning', 'Critical'] },
        link: String
    }],
    interviewScores: {
        identity: Number,
        intent: Number,
        financial: Number,
        knowledge: Number
    },
    finalScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Pending'], default: 'Pending' },
    applicationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    recommendations: [String],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
