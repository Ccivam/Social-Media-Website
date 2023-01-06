const Us=require("../model/user");
module.exports.signUp=function(req,res){
   // console.log(req.cookies);
   if(req.isAuthenticated()){
    return res.redirect('/profile');
   }
   return res.render('user_sign_up',{
    title:"codeial|sign up"
   });
}
module.exports.signIn=function(req,res){
    if(req.isAuthenticated()){
       return res.redirect('/profile');
       }
   return res.render('user_sign_in',{
    title:"codeial|sign in"
   })
}
//get the signup data

module.exports.createSession=function(req,res){
       return res.redirect('/profile');
    }
module.exports.profile=function(req,res){
    res.render('user_profile',{
        user:res.locals.user
    });

}
module.exports.destroySession=function(req,res){
    req.logout(function(err){
        if(err){console.log('error in logging out');return res.redirect('signin');}
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