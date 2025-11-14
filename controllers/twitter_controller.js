const User = require('../model/user');
const Post = require('../model/post');
const { TwitterApi } = require('twitter-api-v2');

// Note: You need to set these in your environment variables or config
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || 'your_api_key';
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || 'your_api_secret';
const TWITTER_CALLBACK_URL = process.env.TWITTER_CALLBACK_URL || 'http://localhost:8000/twitter/callback';

// Connect Twitter account
module.exports.connectTwitter = async function(req, res) {
    try {
        // Check if API keys are configured
        if (TWITTER_API_KEY === 'your_api_key' || TWITTER_API_SECRET === 'your_api_secret') {
            req.flash('error', 'Twitter API keys not configured. Please set up your Twitter Developer account and add API keys to environment variables.');
            return res.redirect('/profile');
        }

        const client = new TwitterApi({
            appKey: TWITTER_API_KEY,
            appSecret: TWITTER_API_SECRET,
        });

        // Generate auth link with proper callback
        const authLink = await client.generateAuthLink(TWITTER_CALLBACK_URL, {
            linkMode: 'authorize',
            forceLogin: false
        });

        // Store oauth_token_secret in session for callback
        req.session.oauth_token_secret = authLink.oauth_token_secret;
        req.session.oauth_token = authLink.oauth_token;

        console.log('Generated auth link:', authLink.url);
        console.log('Callback URL:', TWITTER_CALLBACK_URL);

        return res.redirect(authLink.url);
    } catch (err) {
        console.log('Error connecting Twitter:', err);
        if (err.data && err.data['<?xml version']) {
            req.flash('error', 'Twitter app must be configured as "Web App" not "Desktop App". Please update your app settings in Twitter Developer Portal.');
        } else {
            req.flash('error', 'Error connecting to Twitter. Please check your API credentials and app settings.');
        }
        return res.redirect('/profile');
    }
};

// Twitter OAuth callback
module.exports.twitterCallback = async function(req, res) {
    try {
        const { oauth_token, oauth_verifier } = req.query;
        const { oauth_token_secret } = req.session;

        if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
            req.flash('error', 'Twitter authentication failed');
            return res.redirect('/profile');
        }

        const client = new TwitterApi({
            appKey: TWITTER_API_KEY,
            appSecret: TWITTER_API_SECRET,
            accessToken: oauth_token,
            accessSecret: oauth_token_secret,
        });

        const { client: loggedClient, accessToken, accessSecret } = await client.login(oauth_verifier);

        // Get user info
        const twitterUser = await loggedClient.v2.me();

        // Update user with Twitter credentials
        await User.findByIdAndUpdate(req.user._id, {
            'twitter.connected': true,
            'twitter.username': twitterUser.data.username,
            'twitter.accessToken': accessToken,
            'twitter.accessTokenSecret': accessSecret,
            'twitter.userId': twitterUser.data.id,
            'twitter.lastSync': new Date()
        });

        // Clean up session
        delete req.session.oauth_token_secret;

        req.flash('success', 'Twitter account connected successfully!');
        return res.redirect('/profile');
    } catch (err) {
        console.log('Error in Twitter callback:', err);
        req.flash('error', 'Error connecting Twitter account');
        return res.redirect('/profile');
    }
};

// Disconnect Twitter
module.exports.disconnectTwitter = async function(req, res) {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            'twitter.connected': false,
            'twitter.username': null,
            'twitter.accessToken': null,
            'twitter.accessTokenSecret': null,
            'twitter.userId': null
        });

        req.flash('success', 'Twitter account disconnected');
        return res.redirect('/profile');
    } catch (err) {
        console.log('Error disconnecting Twitter:', err);
        req.flash('error', 'Error disconnecting Twitter');
        return res.redirect('/profile');
    }
};

// Sync tweets from Twitter
module.exports.syncTweets = async function(req, res) {
    try {
        const user = await User.findById(req.user._id);

        if (!user.twitter.connected) {
            return res.json({
                success: false,
                message: 'Twitter account not connected'
            });
        }

        const client = new TwitterApi({
            appKey: TWITTER_API_KEY,
            appSecret: TWITTER_API_SECRET,
            accessToken: user.twitter.accessToken,
            accessSecret: user.twitter.accessTokenSecret,
        });

        // Get user's tweets
        const tweets = await client.v2.userTimeline(user.twitter.userId, {
            max_results: 10,
            exclude: ['retweets', 'replies'],
            'tweet.fields': ['created_at', 'text']
        });

        let importedCount = 0;

        // Import tweets as posts
        for (const tweet of tweets.data.data || []) {
            // Check if tweet already imported
            const existingPost = await Post.findOne({
                user: user._id,
                content: tweet.text,
                twitterId: tweet.id
            });

            if (!existingPost) {
                await Post.create({
                    content: tweet.text,
                    user: user._id,
                    twitterId: tweet.id,
                    importedFromTwitter: true,
                    twitterCreatedAt: tweet.created_at
                });
                importedCount++;
            }
        }

        // Update last sync time
        await User.findByIdAndUpdate(req.user._id, {
            'twitter.lastSync': new Date()
        });

        return res.json({
            success: true,
            message: `Successfully imported ${importedCount} tweets`,
            data: { importedCount }
        });
    } catch (err) {
        console.log('Error syncing tweets:', err);
        return res.json({
            success: false,
            message: 'Error syncing tweets. Please try reconnecting your Twitter account.'
        });
    }
};

// Get Twitter connection status
module.exports.getTwitterStatus = async function(req, res) {
    try {
        const user = await User.findById(req.user._id);
        
        return res.json({
            success: true,
            data: {
                connected: user.twitter.connected,
                username: user.twitter.username,
                lastSync: user.twitter.lastSync
            }
        });
    } catch (err) {
        console.log('Error getting Twitter status:', err);
        return res.json({
            success: false,
            message: 'Error getting Twitter status'
        });
    }
};
