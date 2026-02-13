const mongoose = require('mongoose');

const backgroundCheckSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    riskScore: { type: Number, default: 0 },
    flags: [{ type: String }],
    completedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Clear', 'Flagged'], default: 'Clear' }
}, { timestamps: true });

module.exports = mongoose.model('BackgroundCheck', backgroundCheckSchema);
