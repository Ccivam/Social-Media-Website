const Post=require('../model/post');
module.exports.home=function(req,res){
    
    Post.find({}).populate('user').exec(function(err,posts){
        return res.render('Home',{
            posts:posts
        })
       })
}