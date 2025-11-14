const mongoose=require('mongoose');

const postSchema=new mongoose.Schema(
    {
        content:{
            type:String,
            require:true

        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        //include the array of ids of all comments
        comment:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Comment'
            
            }
        ],
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Like'
            }
        ],
        twitterId: {
            type: String
        },
        importedFromTwitter: {
            type: Boolean,
            default: false
        },
        twitterCreatedAt: {
            type: Date
        }
    },{
        timestamps:true
    }
);
const Post=mongoose.model('Post',postSchema);
module.exports=Post;