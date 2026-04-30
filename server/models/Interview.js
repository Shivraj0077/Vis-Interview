const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    transcript: { type: String },
    questions: [{
        question: String,
        answerAudioPath: String,
        answerText: String,
    }],
    currentPhase: { type: Number, default: 1 }, // 1 to 5
    geminiAnalysis: { type: Object }, // Higher fidelity storage for evaluation
    status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
