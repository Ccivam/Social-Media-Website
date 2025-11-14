require('dotenv').config();

const express=require('express');
const env=require('./config/environment');
const logger=require('morgan');

const port=8000;
const cookieParser=require('cookie-parser');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const Localpassport=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle=require('./config/passport-google-oauth-strategy');
const app=express();
const http=require('http');
const server=http.createServer(app);
const io=require('socket.io')(server);
const Chat=require('./model/chat');
require('./config/view-helpers')(app);
const MongoStore=require('connect-mongo');
const flash=require('connect-flash');
const customMware=require('./config/middleware');
const alert=require('alert');
app.use(express.urlencoded());
app.use(cookieParser());

app.set('view engine','ejs');

app.set('views','./views');
app.use(express.static(env.asset_path));
app.use('/uploads',express.static(__dirname+'/uploads'));
app.use(logger(env.morgan.mode,env.morgan.options));

//mongo store is use to store the session cookie in the db
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment in production mode
    secret:env.session_cookie_key,//key for encryption
    saveUninitialized:false,//
    resave:false,
    cookie:{
        maxAge:(1000*60*100)//It is in milliseconds
    },
   store:MongoStore.create({
    mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1/passportauthentication',
    autoRemove:'disabled'
   },
   function(err){
    console.log(err,'connect-mongodb setup error');
   }
   )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash())//it has to  be written after session
app.use(customMware.setFlash);
app.use('/',require('./routes/users'));

// Socket.io for real-time chat and notifications
const Notification = require('./model/notification');
const notificationsController = require('./controllers/notifications_controller');

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', (userId) => {
        socket.join(userId);
        console.log('User joined room:', userId);
    });

    socket.on('send_message', async (data) => {
        try {
            const chat = await Chat.create({
                sender: data.senderId,
                receiver: data.receiverId,
                message: data.message
            });

            const populatedChat = await Chat.findById(chat._id).populate('sender receiver', 'name avatar');
            
            io.to(data.receiverId).emit('receive_message', populatedChat);
            io.to(data.senderId).emit('message_sent', populatedChat);

            // Create notification for message
            const sender = await require('./model/user').findById(data.senderId);
            const notification = await notificationsController.createNotification(
                data.receiverId,
                data.senderId,
                'message',
                `${sender.name} sent you a message`,
                '/chat'
            );

            if(notification) {
                const populatedNotification = await Notification.findById(notification._id).populate('sender', 'name avatar');
                io.to(data.receiverId).emit('new_notification', populatedNotification);
            }
        } catch (err) {
            console.log('Error sending message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
