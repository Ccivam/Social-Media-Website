const User = require('../model/user');

module.exports.allUsers = async function(req, res) {
    try {
        const currentUser = await User.findById(req.user._id)
            .populate('friends', '_id')
            .populate('friendRequests', '_id')
            .populate('sentRequests', '_id');

        const users = await User.find({ _id: { $ne: req.user._id } })
            .select('name email avatar')
            .sort('name');

        return res.render('all_users', {
            title: 'All Users',
            users: users,
            currentUser: currentUser
        });
    } catch (err) {
        console.log('Error loading all users:', err);
        req.flash('error', 'Error loading users');
        return res.redirect('back');
    }
};
