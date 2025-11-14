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

    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    friendRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    sentRequests:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    twitter: {
        connected: {
            type: Boolean,
            default: false
        },
        username: String,
        accessToken: String,
        accessTokenSecret: String,
        userId: String,
        lastSync: Date
    },
    notificationSettings: {
        friendRequests: {
            type: Boolean,
            default: true
        },
        comments: {
            type: Boolean,
            default: true
        },
        likes: {
            type: Boolean,
            default: true
        },
        messages: {
            type: Boolean,
            default: true
        }
    }
},{
        timestamps:true
});
//We will use diskstorage as we are storing on the same device.
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(AVATAR_PATH);
      cb(null, path.join(__dirname+'..'+AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
//static functions
userSchema.statics.uploadedAvatar=multer({storage:storage,limits: { fileSize: 10 * 1024 * 1024 }}).single('avatar');//.single will ensure that only one file will be uploaded for avatar fieldname
userSchema.statics.avatarPath=AVATAR_PATH;
const User=mongoose.model('User',userSchema);
module.exports=User;