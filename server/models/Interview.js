const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    transcript: { type: String },
    questions: [{
        question: String,
        answerAudioPath: String,
        answerText: String,
    }],
    geminiAnalysis: {
        credibilityScore: { type: Number },
        academicIntentScore: { type: Number },
        financialUnderstandingScore: { type: Number },
        explanation: { type: String }
    },
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
