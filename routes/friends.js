const express = require('express');
const router = express.Router();
const passport = require('passport');
const friendsController = require('../controllers/friends_controller');

router.post('/send-request', passport.checkAuthentication, friendsController.sendRequest);
router.post('/accept-request', passport.checkAuthentication, friendsController.acceptRequest);
router.post('/reject-request', passport.checkAuthentication, friendsController.rejectRequest);
router.post('/remove-friend', passport.checkAuthentication, friendsController.removeFriend);

module.exports = router;
