const User=require('../model/user');
const Post=require('../model/post');
const Comment=require('../model/comment');
module.exports.create=async function(req,res){
  try{
    let post=await Post.create({
        content:req.body.content,
        user:req.user._id
      });
      let name=User.findById(req.user._id)

     
      if(req.xhr){
        return res.status(200).json({
          data:{
            post:post,
            name:name


          },
          message:"Post created!"
        })
      }
      
  }catch(err){
    console.log("error:",err);
    return;

  }
 
}
  


module.exports.destroy=async function(req,res){
   try{
    let post=await Post.findById(req.params.id);
        //.id means converting the object id into string
          if(post.user==req.user.id){
              post.remove();
              await Comment.deleteMany({post:req.params.id});
              if(req.xhr){
                return res.status(200).json({
                        data:{
                          post_id:req.params.id
                        },
                        message:"Post deleted successfully"
                });       
              }
                     // return res.redirect('back');
          }
    }catch(err){
        console.log("error:",err);
        return;
    }

         

   }
