const express = require('express');
const { generateQuestions, submitAnswer, togglePin } = require('../controllers/aiController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/generate-questions', auth, generateQuestions);
router.post('/submit-answer', auth, submitAnswer);
router.post('/toggle-pin', auth, togglePin);

module.exports = router;