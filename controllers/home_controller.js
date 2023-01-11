const Post=require('../model/post');
module.exports.home=function(req,res){
    Post.find({})
   .populate('user')
   .populate({
      path:'comment',
      populate:{
      path:'user'
      }
      
   })
   .exec(function(err,posts){
    return res.render('Home',{
        posts:posts
    })
   })
}