const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getStudentProfile, uploadDocument, submitAnswer, getNextInterviewQuestion, runHolisticAnalysis } = require('../controllers/studentController');

router.get('/profile', protect, getStudentProfile);
router.post('/upload', protect, upload.array('files'), uploadDocument);
router.post('/answer', protect, upload.single('audio'), submitAnswer);
router.get('/interview/next', protect, getNextInterviewQuestion);
router.post('/analyze-all', protect, runHolisticAnalysis);

module.exports = router;
