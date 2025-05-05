const express = require('express');
const { trackVisitor, getVisitorStats, getVisitorLogs } = require('../controllers/visitor');
const router = express.Router();
const { userAuth } = require('../middlewares/userAuth.js');
const { userRole } = require('../middlewares/userRole.js');

// Public route - track visitors
router.post('/track', trackVisitor);

// Protected routes - only for admins or authenticated users
router.get('/stats', getVisitorStats);
router.get('/logs', getVisitorLogs);

module.exports = router;