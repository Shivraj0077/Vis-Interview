const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Document = require('../models/Document');
const Interview = require('../models/Interview');
const BackgroundCheck = require('../models/BackgroundCheck');
const User = require('../models/User');

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
const getStudents = asyncHandler(async (req, res) => {
    const students = await Student.find({}).sort({ finalScore: -1 }).populate('user', 'name email');
    res.json(students);
});

// @desc    Get student details
// @route   GET /api/admin/student/:id
// @access  Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id).populate('user', 'name email');
    if (student) {
        const documents = await Document.find({ student: student._id });
        const interview = await Interview.findOne({ student: student._id });
        const background = await BackgroundCheck.findOne({ student: student._id });

        res.json({ student, documents, interview, background });
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

// @desc    Update student status
// @route   PUT /api/admin/student/:id/status
// @access  Private/Admin
const updateStudentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const student = await Student.findById(req.params.id);

    if (student) {
        student.applicationStatus = status;
        await student.save();
        res.json(student);
    } else {
        res.status(404);
        throw new Error('Student not found');
    }
});

module.exports = { getStudents, getStudentById, updateStudentStatus };
