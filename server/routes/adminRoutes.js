const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { getStudents, getStudentById, updateStudentStatus } = require('../controllers/adminController');

router.get('/students', protect, admin, getStudents);
router.get('/student/:id', protect, admin, getStudentById);
router.put('/student/:id/status', protect, admin, updateStudentStatus);

module.exports = router;
