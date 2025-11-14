const like=require('../model/like');
const Comment=require('../model/comment');
const Post=require('../model/post');
const User=require('../model/user');
const { createNotification } = require('./notifications_controller');

module.exports.toggleLike=async function(req,res){
    try{
        //url structure= likes/toggle/?id=abcde&type=Post
        let likeable;
        let deleted=false;
        
        if(req.query.type=="Post"){
           likeable=await Post.findById(req.query.id).populate('likes').populate('user');
           
         
        }else{
             likeable=await Comment.findById(req.query.id).populate('likes').populate('user');
        }
        //check if like already exists
         let existingLike=await like.findOne({
             likeable:req.query.id,
             onModel:req.query.type,
             user:req.user._id
         });
         //If a like already exists then delete it
         if(existingLike){
               likeable.likes.pull(existingLike._id);
               likeable.save();
               like.deleteOne(existingLike,function(err){
                    if(err){
                      console.log("error");
                    }
               });
               //like.save();
               deleted=true;
         }else{
           // make a new like
           let newLike=await like.create({
            user:req.user._id,
            likeable:req.query.id,
            onModel:req.query.type
           });
           likeable.likes.push(newLike._id);
           likeable.save();

           // Create notification (if not liking own content)
           if(likeable.user && likeable.user._id.toString() !== req.user._id.toString()) {
               const contentType = req.query.type === 'Post' ? 'post' : 'comment';
               await createNotification(
                   likeable.user._id,
                   req.user._id,
                   'like',
                   `${req.user.name} liked your ${contentType}`,
                   `/profile/${likeable.user._id}`,
                   req.query.type === 'Post' ? req.query.id : null,
                   req.query.type === 'Comment' ? req.query.id : null
               );
           }
         }
          return res.status(200).json({
            message:"Request successful!",
            data:{
                deleted:deleted
            }
          });
    }catch(err){
          console.log(err);
          return res.status(500).json({
            message:"Internal Server error"
          })
    }
}