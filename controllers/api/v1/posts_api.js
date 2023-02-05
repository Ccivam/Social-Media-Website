const Post=require('../../../model/post');
const Comment=require('../../../model/comment');
const passport=require('passport');
module.exports.index=async function(req,res){
    
        let post=await Post.find({})
        .populate('user')
        .populate({
           path:'comment',
           populate:{
           path:'user'
           }
           
        });
    
        
   return res.json(200,{
    message:"Lists of posts",
    post:post
   })
}
module.exports.destroy=async function(req,res){
    try{
     let post=await Post.findById(req.params.id);
         //.id means converting the object id into string
        if(post.user==req.user.id){
               post.remove();
               await Comment.deleteMany({post:req.params.id});
              
 
            return res.json(200,{
                message:"Post and associated comments are deleted"
            });
        }else{
            return res.json(401,{
                message:"You canot delete this post"
            })
        }
           
     }catch(err){
        console.log(err);
         return res.json(500,{
           
            message:"Internal server error"
         });
     }
    }
          
 
    
   
   

