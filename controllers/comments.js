const comments=require('../model/comment');
const Post = require('../model/post');

module.exports.create=function(req,res){
     Post.findById(req.body.post,function(err,post){
        if(post){
            comments.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,Comments){
                if(err){console.log('error in creating comments');return;}
                
                post.comment.push(Comments);
                post.save();
                

                
                
                res.redirect('back');
            });
        }
     })   

}
module.exports.destroy=function(req,res){
    comments.findById(req.params.id,function(err,comment){
        if(comment.user==req.user.id){
            let postid=comment.post;
            comment.remove();
            Post.findByIdAndUpdate(postid,{$pull: {comment:req.params.id}},function(err,post){
              return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    })
}