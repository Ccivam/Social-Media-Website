const like=require('../model/like');
const Comment=require('../model/comment');
const Post=require('../model/post');

module.exports.toggleLike=async function(req,res){
    try{
        //url structure= likes/toggle/?id=abcde&type=Post
        let likeable;
        let deleted=false;
        
        if(req.query.type=="Post"){
           likeable=await Post.findById(req.query.id).populate('likes');
           
         
        }else{
             likeable=await Comment.findById(req.query.id).populate('likes');
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
               existingLike.remove();

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