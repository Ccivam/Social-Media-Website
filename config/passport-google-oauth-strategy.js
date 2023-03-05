const passport=require('passport');
const googleStratey=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../model/user');
const env=require('./environment');


passport.use(new googleStratey({
            clientID:env.google_client_id,
            clientSecret:env.google_client_secret,
            callbackURL:env.google_call_back_url    
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