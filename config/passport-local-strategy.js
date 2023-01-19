const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const User=require('../model/user');

//Authentication using passport
passport.use(new LocalStrategy({
   usernameField:'email',
   passReqToCallback:true
},
function(req,email,password,done){
    //find a user and established the identity
   User.findOne({email:email},function(err,user){
       if(err){
        req.flash('error',err);
       }
       if(!user||user.password!=password){
        req.flash('error','Invalid username/password');
        return done(null,false);
       }
      return done(null,user);
   });
}
));
//serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
    done(null,user.id);
});


//deserializing the user from he key in the cookie
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log('error in finding user');
            return done(err);
        }
        return done(null,user);
    })
});
//check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    //if the user is signed in,then pass on the request to the next function which is controller actiion
    if(req.isAuthenticated()){
        return next();
    }
    //if the user is not sign in
    return res.redirect('/signin');
}
passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current sign in user from the session cookie and we are just send this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;