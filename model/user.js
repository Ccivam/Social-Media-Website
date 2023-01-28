const mongoose=require('mongoose');
const multer=require('multer');
const path=require('path');
const AVATAR_PATH=path.join('/uploads/users/avatars');
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    
    },
    name:{
        type:String,
        requied:true
    },
    avatar:{
        type:String,

    }
},{
        timestamps:true
});
//We will use diskstorage as we are storing on the same device.
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
//static functions
userSchema.statics.uploadedAvatar=multer({storage:storage}).single('avatar');//.single will ensure that only one file will be uploaded for avatar fieldname
userSchema.statics.avatarPath=AVATAR_PATH;
const User=mongoose.model('User',userSchema);
module.exports=User;