const passport=require('passport');
const googleStratey=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../model/user');



passport.use(new googleStratey({
            clientID:"716926697135-1p7g1tep9ube9hoig17e2nc3d8kj8rog.apps.googleusercontent.com",
            clientSecret:"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",
            callbackURL:"http://localhost:8000/users/auth/google/callback"    
           },

           function(accessToken,refreshToken,profile,done){
                  console.log(accessToken);
                  User.findOne({email:profile.emails[0].value}).exec(function(err,user){
                    if(err){console.log("error in google strategy passport",err);return;}


                    console.log(profile);
                    if(user){
                        return done(null,user);
                    }else{
                        User.create({
                            name:profile.displayName,
                            email:profile.emails[0].value,
                            password:crypto.randomBytes(20).toString('hex')

                        },function(err,user){
                            if(err){console.log("error in google strategy passport",err);return;}
                               return done(null,user);
                        })
                    }
                  })

           }

));
module.exports=passport;