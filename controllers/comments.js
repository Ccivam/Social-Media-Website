const comments=require('../model/comment');
const Post = require('../model/post');
const Like=require('../model/like');
const User = require('../model/user');
const { createNotification } = require('./notifications_controller');

module.exports.create=async function(req,res){
    try{
     let post=await Post.findById(req.body.post).populate('user');
        if(post){
          let Comments =await comments.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
    
                post.comment.push(Comments);
                post.save();

                // Create notification for post owner (if not commenting on own post)
                if(post.user._id.toString() !== req.user._id.toString()) {
                    await createNotification(
                        post.user._id,
                        req.user._id,
                        'comment',
                        `${req.user.name} commented on your post`,
                        `/profile/${post.user._id}`,
                        post._id,
                        Comments._id
                    );
                }
              
              if(req.xhr){
                 return res.status(200).json({
                    comments:Comments,
                    message:"comment created"
                 }
                 )
                 
              }
             // res.redirect('back');
            
        }
        
    }catch(err){
         console.log("ERROR:",err);
    }

}
module.exports.destroy=async function(req,res){
    try{
        let comment=await comments.findById(req.params.id);
        if(comment.user==req.user.id){
            let postid=comment.post;
            await Like.deleteMany({likeable:comment._id,onModel:'Comment'});
            comment.remove();
            await Post.findByIdAndUpdate(postid,{$pull: {comment:req.params.id}})
            if(req.xhr){
               return res.status(200).json(
                {
                    data:{
                        comment_id:req.params.id
                    },
                    message:"comment deleted successfully"
                }
               );

               
            }
              
        }else{
           return res.redirect('back');
        }
        
    }catch(err){
        console.log("error:",err);

    }
    
}