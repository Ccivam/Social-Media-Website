const express = require('express');
const router = express.Router();
const passport = require('passport');
const socialGraphController = require('../controllers/social_graph_controller');

// Social graph page
router.get('/', passport.checkAuthentication, socialGraphController.socialGraphPage);

// Find connection between users
router.post('/find-connection', passport.checkAuthentication, socialGraphController.findConnection);

// Get friend suggestions
router.get('/suggestions', passport.checkAuthentication, socialGraphController.getFriendSuggestions);

module.exports = router;
