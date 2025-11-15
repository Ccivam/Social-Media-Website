const express = require('express');
const router = express.Router();
const passport = require('passport');
const notificationsController = require('../controllers/notifications_controller');

router.get('/', passport.checkAuthentication, notificationsController.getNotifications);
router.get('/unread-count', passport.checkAuthentication, notificationsController.getUnreadCount);
router.post('/mark-read/:id', passport.checkAuthentication, notificationsController.markAsRead);
router.post('/mark-all-read', passport.checkAuthentication, notificationsController.markAllAsRead);
router.post('/settings', passport.checkAuthentication, notificationsController.updateSettings);
router.delete('/:id', passport.checkAuthentication, notificationsController.deleteNotification);

module.exports = router;
