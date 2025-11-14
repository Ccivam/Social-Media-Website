const Chat = require('../model/chat');
const User = require('../model/user');
const { createNotification } = require('./notifications_controller');

// Get chat page
module.exports.chatPage = async function(req, res) {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends', 'name avatar email');
        
        return res.render('chat', {
            title: 'Chat',
            friends: user.friends
        });
    } catch (err) {
        console.log('Error loading chat page:', err);
        return res.redirect('back');
    }
};

// Get chat history
module.exports.getChatHistory = async function(req, res) {
    try {
        const userId = req.user._id;
        const friendId = req.params.friendId;

        const messages = await Chat.find({
            $or: [
                { sender: userId, receiver: friendId },
                { sender: friendId, receiver: userId }
            ]
        }).sort('createdAt').populate('sender receiver', 'name avatar');

        return res.json({
            success: true,
            data: { messages }
        });
    } catch (err) {
        console.log('Error getting chat history:', err);
        return res.json({
            success: false,
            message: 'Error loading chat history'
        });
    }
};
