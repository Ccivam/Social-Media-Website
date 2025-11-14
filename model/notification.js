const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['friend_request', 'friend_accept', 'comment', 'like', 'message'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    },
    relatedPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    relatedComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
