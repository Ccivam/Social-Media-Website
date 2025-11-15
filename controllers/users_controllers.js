const Us=require("../model/user");
const Post=require('../model/post');
const User = require("../model/user");
const alert=require('alert');
const fs=require('fs');
const path=require('path');
module.exports.signUp=function(req,res){
   // console.log(req.cookies);
   if(req.isAuthenticated()){
    return res.redirect('/profile/');
   }
   return res.render('user_sign_up',{
    title:"Switter | Sign Up"
   });
    }
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/profile/');
       }
   
   return res.render('user_sign_in',{
    title:"Switter | Sign In"
   })
}
//get the signup data

module.exports.createSession=function(req,res){
       req.flash("success","Logged in Successfully");

       return res.redirect('/profile/');
    }
module.exports.profile=async function(req,res){
    try{
        console.log('Loading profile for user:', req.params.id || req.user._id);
        
        const profileUserId = req.params.id || req.user._id;
        
        // Get profile user with populated friends
        const profileUser = await User.findById(profileUserId)
            .populate('friends', 'name avatar email')
            .populate('friendRequests', 'name avatar email')
            .populate('sentRequests', 'name avatar email');

        console.log('Profile user found:', profileUser ? profileUser.name : 'NOT FOUND');

        if (!profileUser) {
            console.log('Profile user not found, redirecting');
            req.flash('error', 'User not found');
            return res.redirect('/');
        }

        // Get posts (all posts or just user's posts)
        const posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path:'comment',
                populate:[
                    {path:'user'},
                    {path:'likes'}
                ]
            })
            .populate('likes');

        console.log('Posts found:', posts.length);
        console.log('Rendering profile page...');

        return res.render('user_profile',{
            title: profileUser.name + ' - Profile',
            posts: posts,
            profile_user: profileUser
        });
    }catch(err){
        console.log('Error loading profile:', err);
        console.log('Error stack:', err.stack);
        req.flash('error', 'Error loading profile');
        return res.redirect('/');
    }
}

module.exports.destroySession=function(req,res){
    req.logout(function(err){
        if(err){console.log('error in logging out');return res.redirect('signin');}
        req.flash('success',"Logged out Successfully");
        res.redirect('signin');
    });
  
}
module.exports.c=function(req,res){
    Us.findOne({email:req.body.email},function(err,user){
         if(err){console.log('error in creating user');return res.redirect('back');};
         if(!user){
            Us.create(req.body,function(err,user){
                if(err){console.log('error');res.redirect('back');};
                res.redirect('/signin');
            })

         }else{
            res.redirect('back');
         }

    });
}
module.exports.update=async function(req,res){
     
   // if(req.user.id==req.params.id){
    //    User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
    //           return res.redirect('back');
    //    });
    //}else{
    //    return res.status(401).send("Unauthorized");
    //}
    if(req.user.id==req.params.id){
                try{
                    let user=await User.findById(req.params.id);
                    User.uploadedAvatar(req,res,function(err){
                           if(err){
                            console.log("****Multer Error*****");

                           }else{
                               
                               user.name=req.body.name;
                               user.email=req.body.email;
                              if(req.file){
                                //this is saving the path of the loaded file into the avatar field of the user
                                // Delete old avatar if it exists
                                if(user.avatar && user.avatar.length > 0){
                                    const oldAvatarPath = path.join(__dirname, '..', user.avatar);
                                    if(fs.existsSync(oldAvatarPath)){
                                        fs.unlinkSync(oldAvatarPath);
                                    }
                                }
                                user.avatar=User.avatarPath+'/'+req.file.filename;
                               }
                               user.save();
                               req.flash('success', 'Profile updated successfully');
                               return res.redirect('back');
                           }
                        })
                    
                     

                }catch(err){
                    return res.redirect('back');
                }
    }else{
        return res.status(401).send("Unauthorized");
    }
}

module.exports.updateInformation=function(req,res){
    res.render('update-information');
}