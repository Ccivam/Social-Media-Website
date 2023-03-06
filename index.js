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
app.use(flash())//it has to  be written after session
app.use(customMware.setFlash);
app.use('/',require('./routes/users'));

app.listen(port);
