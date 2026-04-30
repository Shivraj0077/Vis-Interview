const asyncHandler = require('express-async-handler');
const { getJobs, getLegalHelp } = require('../services/resourceService');
const Student = require('../models/Student');
const Document = require('../models/Document');

// @desc    Get Student Resources (Jobs and Legal)
// @route   GET /api/resources
// @access  Private
const getResources = asyncHandler(async (req, res) => {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) {
        res.status(404);
        throw new Error('Student profile not found');
    }

    // Try to find the city from I-20 or Bank Statement
    const i20 = await Document.findOne({ student: student._id, type: 'Form I-20' });
    let city = 'Boston'; // Default
    if (i20 && i20.extractedData?.schoolName) {
        // Simple mapping or parsing if possible, fallback for now
        city = i20.extractedData.schoolName.split(' ')[0];
    }

    const jobs = await getJobs(city);
    const legal = await getLegalHelp();

    res.json({ jobs, legal });
});

module.exports = { getResources };
