const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { getStudentProfile, uploadDocument, submitAnswer } = require('../controllers/studentController');

router.get('/profile', protect, getStudentProfile);
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.post('/answer', protect, upload.single('audio'), submitAnswer);

module.exports = router;
