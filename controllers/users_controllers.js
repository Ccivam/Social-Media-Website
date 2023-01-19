const Us=require("../model/user");
const Post=require('../model/post');
const User = require("../model/user");
const alert=require('alert');
module.exports.signUp=function(req,res){
   // console.log(req.cookies);
   if(req.isAuthenticated()){
    return res.redirect('/profile/');
   }
   return res.render('user_sign_up',{
    title:"codeial|sign up"
   });
    }
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/profile/');
       }
   
   return res.render('user_sign_in',{
    title:"codeial|sign in"
   })
}
//get the signup data

module.exports.createSession=function(req,res){
       req.flash("success","Logged in Successfully");

       return res.redirect('/profile/');
    }
module.exports.profile=function(req,res){
    
  
   
   Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate({
      path:'comment',
      populate:{
      path:'user'
      }
      
   })
   .exec(function(err,posts){
    User.findById(req.params.id,function(err,user){
        User.find({},function(err,all){
        return res.render('user_profile',{
            posts:posts,
            profile_user:user,
            all_users:all
        })
    });
    });
    
   })

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
module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
               return res.redirect('back');
        });
    }else{
        return res.status(401).send("Unauthorized");
    }
}