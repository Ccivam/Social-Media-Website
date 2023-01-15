const comments=require('../model/comment');
const Post = require('../model/post');

module.exports.create=async function(req,res){
    try{
     let post=await Post.findById(req.body.post);
        if(post){
          let Comments =await comments.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            });
                
                post.comment.push(Comments);
                post.save();
                res.redirect('back');
            
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
            comment.remove();
            await Post.findByIdAndUpdate(postid,{$pull: {comment:req.params.id}})
              return res.redirect('back');
        }else{
           return res.redirect('back');
        }
        
    }catch(err){
        console.log("error:",err);

    }
    
}