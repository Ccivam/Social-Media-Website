const Post=require('../model/post');
const User=require('../model/user');
const like=require('../model/like');
module.exports.home=async function(req,res){
    try{
        let post=await Post.find({})
        .populate('user')
        .populate({
           path:'comment',
           populate:{
           path:'user'
           },
           populate:{
            path:'likes'
           }
           
        })
        .populate('likes');
        let users=await User.find({});
        return res.render('Home',{
         posts:post,
         all_users:users
        });
     
    }catch(err){
             console.log("ERROR:",err);
             return;
    };
    
   
}
