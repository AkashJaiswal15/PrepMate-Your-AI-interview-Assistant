const express = require('express');
const { getDashboard, getSession } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getDashboard);
router.get('/session/:id', auth, getSession);

module.exports = router;