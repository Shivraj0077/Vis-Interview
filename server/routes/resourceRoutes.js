const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getResources } = require('../controllers/resourceController');

router.get('/', protect, getResources);

module.exports = router;
