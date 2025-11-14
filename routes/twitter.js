const express = require('express');
const router = express.Router();
const passport = require('passport');
const twitterController = require('../controllers/twitter_controller');

router.get('/connect', passport.checkAuthentication, twitterController.connectTwitter);
router.get('/callback', passport.checkAuthentication, twitterController.twitterCallback);
router.post('/disconnect', passport.checkAuthentication, twitterController.disconnectTwitter);
router.post('/sync', passport.checkAuthentication, twitterController.syncTweets);
router.get('/status', passport.checkAuthentication, twitterController.getTwitterStatus);

module.exports = router;
