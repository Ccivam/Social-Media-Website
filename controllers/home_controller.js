const Post=require('../model/post');
const User=require('../model/user');
module.exports.home=async function(req,res){
    try{
        let post=await Post.find({})
        .populate('user')
        .populate({
           path:'comment',
           populate:{
           path:'user'
           }
           
        });
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
