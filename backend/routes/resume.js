const express = require('express');
const { upload, uploadResume } = require('../controllers/resumeController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/upload', auth, upload.single('resume'), uploadResume);

module.exports = router;