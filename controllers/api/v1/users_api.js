const User=require('../../../model/user');
const jwt=require('jsonwebtoken');
const env=require('../../../config/environment');
module.exports.createSession=async function(req,res){
    try{
    let user=await User.findOne({email:req.body.email});
    if(!user||user.password!=req.body.password){
        return res.json(422,{
            message:"Invalid username or password"
        })
    } 
    return res.json(200,{
        message:"signin successful",
        data:{
            token:jwt.sign(user.toJSON(),env.jwt_key,{expiresIn:'10000'})
        }
    });
    }catch(err){
        console.log(err);
          return res.json(500,{
            
            message:"INTERNAL SERVER ERROR"
          })
    }

}