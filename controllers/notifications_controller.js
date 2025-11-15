const Notification = require('../model/notification');
const User = require('../model/user');

// Get all notifications for current user
module.exports.getNotifications = async function(req, res) {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'name avatar')
            .sort('-createdAt')
            .limit(50);

        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user._id, 
            read: false 
        });

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                success: true,
                data: {
                    notifications,
                    unreadCount
                }
            });
        }

        return res.render('notifications', {
            title: 'Notifications',
            notifications,
            unreadCount
        });
    } catch (err) {
        console.log('Error getting notifications:', err);
        return res.status(500).json({
            success: false,
            message: 'Error loading notifications'
        });
    }
};

// Mark notification as read
module.exports.markAsRead = async function(req, res) {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { read: true });
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                success: true,
                message: 'Notification marked as read'
            });
        }
        
        req.flash('success', 'Notification marked as read');
        return res.redirect('back');
    } catch (err) {
        console.log('Error marking notification as read:', err);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({
                success: false,
                message: 'Error updating notification'
            });
        }
        req.flash('error', 'Error updating notification');
        return res.redirect('back');
    }
};

// Mark all notifications as read
module.exports.markAllAsRead = async function(req, res) {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, read: false },
            { read: true }
        );
        
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json({
                success: true,
                message: 'All notifications marked as read'
            });
        }
        
        req.flash('success', 'All notifications marked as read');
        return res.redirect('back');
    } catch (err) {
        console.log('Error marking all as read:', err);
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(500).json({
                success: false,
                message: 'Error updating notifications'
            });
        }
        req.flash('error', 'Error updating notifications');
        return res.redirect('back');
    }
};

// Delete notification
module.exports.deleteNotification = async function(req, res) {
    try {
        const notification = await Notification.findById(req.params.id);
        
        if (notification.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        await notification.remove();
        
        return res.json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (err) {
        console.log('Error deleting notification:', err);
        return res.status(500).json({
            success: false,
            message: 'Error deleting notification'
        });
    }
};

// Get unread count
module.exports.getUnreadCount = async function(req, res) {
    try {
        const count = await Notification.countDocuments({ 
            recipient: req.user._id, 
            read: false 
        });
        
        return res.json({
            success: true,
            data: { count }
        });
    } catch (err) {
        console.log('Error getting unread count:', err);
        return res.status(500).json({
            success: false,
            message: 'Error getting count'
        });
    }
};

// Helper function to create notification
module.exports.createNotification = async function(recipientId, senderId, type, content, link, relatedPost, relatedComment) {
    try {
        // Check if user has this notification type enabled
        const recipient = await User.findById(recipientId);
        
        if (!recipient) return;

        // Check notification settings
        const settingKey = type === 'friend_request' || type === 'friend_accept' ? 'friendRequests' :
                          type === 'comment' ? 'comments' :
                          type === 'like' ? 'likes' :
                          type === 'message' ? 'messages' : null;

        if (settingKey && recipient.notificationSettings && !recipient.notificationSettings[settingKey]) {
            return; // User has disabled this notification type
        }

        const notification = await Notification.create({
            recipient: recipientId,
            sender: senderId,
            type,
            content,
            link,
            relatedPost,
            relatedComment
        });

        return notification;
    } catch (err) {
        console.log('Error creating notification:', err);
    }
};

// Update notification settings
module.exports.updateSettings = async function(req, res) {
    try {
        const settings = {
            friendRequests: req.body.friendRequests === 'on',
            comments: req.body.comments === 'on',
            likes: req.body.likes === 'on',
            messages: req.body.messages === 'on'
        };

        await User.findByIdAndUpdate(req.user._id, {
            notificationSettings: settings
        });

        req.flash('success', 'Notification preferences updated');
        return res.redirect('back');
    } catch (err) {
        console.log('Error updating notification settings:', err);
        req.flash('error', 'Error updating preferences');
        return res.redirect('back');
    }
};
