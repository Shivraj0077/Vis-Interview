const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    passportNumber: { type: String, required: true },
    dob: { type: Date, required: true },
    finalScore: { type: Number, default: 0 },
    riskLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Pending'], default: 'Pending' },
    applicationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
