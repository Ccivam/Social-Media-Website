const User = require('../model/user');

// Display the social graph page
module.exports.socialGraphPage = async function(req, res) {
    try {
        return res.render('social_graph', {
            title: 'Social Graph - Connection Finder'
        });
    } catch(err) {
        console.log('Error loading social graph page:', err);
        return res.redirect('back');
    }
};

// BFS Algorithm to find shortest path between two users
async function findShortestPath(startUserId, endUserId) {
    if (startUserId.toString() === endUserId.toString()) {
        return {
            found: true,
            distance: 0,
            path: [startUserId],
            message: "Same user"
        };
    }

    const visited = new Set();
    const queue = [];
    const parent = new Map();
    
    // Initialize BFS
    queue.push(startUserId.toString());
    visited.add(startUserId.toString());
    parent.set(startUserId.toString(), null);
    
    while (queue.length > 0) {
        const currentUserId = queue.shift();
        
        // Get current user's friends
        const currentUser = await User.findById(currentUserId).populate('friends', '_id');
        
        if (!currentUser) continue;
        
        // Check each friend
        for (let friend of currentUser.friends) {
            const friendId = friend._id.toString();
            
            if (!visited.has(friendId)) {
                visited.add(friendId);
                parent.set(friendId, currentUserId);
                queue.push(friendId);
                
                // Found the target user
                if (friendId === endUserId.toString()) {
                    // Reconstruct path
                    const path = [];
                    let current = friendId;
                    
                    while (current !== null) {
                        path.unshift(current);
                        current = parent.get(current);
                    }
                    
                    return {
                        found: true,
                        distance: path.length - 1,
                        path: path,
                        message: 'Connected via ' + (path.length - 1) + ' degree' + (path.length - 1 > 1 ? 's' : '') + ' of separation'
                    };
                }
            }
        }
    }
    
    // No path found
    return {
        found: false,
        distance: -1,
        path: [],
        message: "No connection found"
    };
}

// Find mutual friends between two users
async function findMutualFriends(userId1, userId2) {
    const user1 = await User.findById(userId1).populate('friends', '_id');
    const user2 = await User.findById(userId2).populate('friends', '_id');
    
    if (!user1 || !user2) return [];
    
    const user1Friends = new Set(user1.friends.map(f => f._id.toString()));
    const mutualFriends = user2.friends.filter(f => user1Friends.has(f._id.toString()));
    
    return mutualFriends.map(f => f._id);
}

// API endpoint to find connection between users
module.exports.findConnection = async function(req, res) {
    try {
        const { targetEmail } = req.body;
        const currentUserId = req.user._id;
        
        console.log('Searching for email:', targetEmail);
        console.log('Request body:', req.body);
        
        if (!targetEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        
        // Find target user by email (case-insensitive, trim whitespace)
        const targetUser = await User.findOne({ 
            email: new RegExp('^' + targetEmail.trim() + '$', 'i')
        });
        
        console.log('Found user:', targetUser);
        
        if (!targetUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found with that email'
            });
        }
        
        // Find shortest path using BFS
        const pathResult = await findShortestPath(currentUserId, targetUser._id);
        
        // Get current user details
        const currentUser = await User.findById(currentUserId).select('name email avatar _id');
        
        // Get full user details for the path
        const pathUsers = await User.find({
            _id: { $in: pathResult.path }
        }).select('name email avatar _id');
        
        // Create a map for quick lookup
        const userMap = {};
        pathUsers.forEach(user => {
            userMap[user._id.toString()] = user;
        });
        
        // Build ordered path with user details
        const detailedPath = pathResult.path.map(userId => userMap[userId]);
        
        // Find mutual friends if connected
        let mutualFriends = [];
        if (pathResult.found && pathResult.distance === 1) {
            const mutualFriendIds = await findMutualFriends(currentUserId, targetUser._id);
            mutualFriends = await User.find({
                _id: { $in: mutualFriendIds }
            }).select('name email avatar _id');
        }
        
        return res.json({
            success: true,
            data: {
                found: pathResult.found,
                distance: pathResult.distance,
                message: pathResult.message,
                path: detailedPath,
                mutualFriends: mutualFriends,
                currentUser: {
                    _id: currentUser._id,
                    name: currentUser.name,
                    email: currentUser.email,
                    avatar: currentUser.avatar
                },
                targetUser: {
                    _id: targetUser._id,
                    name: targetUser.name,
                    email: targetUser.email,
                    avatar: targetUser.avatar
                }
            }
        });
        
    } catch(err) {
        console.log('Error finding connection:', err);
        return res.status(500).json({
            success: false,
            message: 'Error finding connection'
        });
    }
};

// Get friend suggestions (friends of friends)
module.exports.getFriendSuggestions = async function(req, res) {
    try {
        const currentUser = await User.findById(req.user._id).populate('friends', '_id');
        
        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const currentFriendIds = new Set(currentUser.friends.map(f => f._id.toString()));
        currentFriendIds.add(req.user._id.toString());
        
        const suggestions = new Map();
        
        // For each friend, get their friends
        for (let friend of currentUser.friends) {
            const friendUser = await User.findById(friend._id).populate('friends', '_id name email avatar');
            
            if (friendUser) {
                for (let friendOfFriend of friendUser.friends) {
                    const fofId = friendOfFriend._id.toString();
                    
                    // Skip if already a friend or self
                    if (!currentFriendIds.has(fofId)) {
                        if (suggestions.has(fofId)) {
                            suggestions.get(fofId).mutualCount++;
                        } else {
                            suggestions.set(fofId, {
                                user: friendOfFriend,
                                mutualCount: 1
                            });
                        }
                    }
                }
            }
        }
        
        // Convert to array and sort by mutual friends count
        const suggestionArray = Array.from(suggestions.values())
            .sort((a, b) => b.mutualCount - a.mutualCount)
            .slice(0, 10);
        
        return res.json({
            success: true,
            data: {
                suggestions: suggestionArray
            }
        });
        
    } catch(err) {
        console.log('Error getting friend suggestions:', err);
        return res.status(500).json({
            success: false,
            message: 'Error getting suggestions'
        });
    }
};
