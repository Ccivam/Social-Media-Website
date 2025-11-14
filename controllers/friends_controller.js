const User = require('../model/user');
const { createNotification } = require('./notifications_controller');

// Send friend request
module.exports.sendRequest = async function(req, res) {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        if (userId.toString() === friendId) {
            req.flash('error', 'Cannot send friend request to yourself');
            return res.redirect('back');
        }

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        if (!friend) {
            req.flash('error', 'User not found');
            return res.redirect('back');
        }

        // Check if already friends
        if (user.friends.includes(friendId)) {
            req.flash('error', 'Already friends');
            return res.redirect('back');
        }

        // Check if request already sent
        if (user.sentRequests.includes(friendId)) {
            req.flash('error', 'Friend request already sent');
            return res.redirect('back');
        }

        // Add to sent requests and friend requests
        user.sentRequests.push(friendId);
        friend.friendRequests.push(userId);

        await user.save();
        await friend.save();

        // Create notification
        await createNotification(
            friendId,
            userId,
            'friend_request',
            `${user.name} sent you a friend request`,
            `/profile/${userId}`
        );

        req.flash('success', 'Friend request sent');
        return res.redirect('back');
    } catch (err) {
        console.log('Error sending friend request:', err);
        req.flash('error', 'Error sending friend request');
        return res.redirect('back');
    }
};

// Accept friend request
module.exports.acceptRequest = async function(req, res) {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        // Remove from requests and add to friends
        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
        friend.sentRequests = friend.sentRequests.filter(id => id.toString() !== userId.toString());

        user.friends.push(friendId);
        friend.friends.push(userId);

        await user.save();
        await friend.save();

        // Create notification
        await createNotification(
            friendId,
            userId,
            'friend_accept',
            `${user.name} accepted your friend request`,
            `/profile/${userId}`
        );

        req.flash('success', 'Friend request accepted');
        return res.redirect('back');
    } catch (err) {
        console.log('Error accepting friend request:', err);
        req.flash('error', 'Error accepting friend request');
        return res.redirect('back');
    }
};

// Reject friend request
module.exports.rejectRequest = async function(req, res) {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId);
        friend.sentRequests = friend.sentRequests.filter(id => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        req.flash('success', 'Friend request rejected');
        return res.redirect('back');
    } catch (err) {
        console.log('Error rejecting friend request:', err);
        req.flash('error', 'Error rejecting friend request');
        return res.redirect('back');
    }
};

// Remove friend
module.exports.removeFriend = async function(req, res) {
    try {
        const { friendId } = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        const friend = await User.findById(friendId);

        user.friends = user.friends.filter(id => id.toString() !== friendId);
        friend.friends = friend.friends.filter(id => id.toString() !== userId.toString());

        await user.save();
        await friend.save();

        req.flash('success', 'Friend removed');
        return res.redirect('back');
    } catch (err) {
        console.log('Error removing friend:', err);
        req.flash('error', 'Error removing friend');
        return res.redirect('back');
    }
};
