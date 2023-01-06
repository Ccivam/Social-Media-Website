const express=require('express');
const port=8000;
const cookieParser=require('cookie-parser');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const Localpassport=require('./config/passport-local-strategy');
const app=express();
const MongoStore=require('connect-mongo');
app.use(express.urlencoded());

app.use(cookieParser());
app.set('view engine','ejs');
app.set('views','./views');
//mongo store is use to store the session cookie in the db
app.use(session({
    name:'codeial',
    //TODO change the secret before deployment in production mode
    secret:'blahsomething',//key for encryption
    saveUninitialized:false,//
    resave:false,
    cookie:{
        maxAge:(1000*60*100)//It is in milliseconds
    },
   store:MongoStore.create({
    mongoUrl:'mongodb://127.0.0.1/passportauthentication',
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
app.use('/',require('./routes/users'));
app.listen(port);
