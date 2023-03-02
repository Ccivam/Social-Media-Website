const mongoose=require('mongoose');


const likeschema=new mongoose.Schema({
         user:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
               
         },
         //This defines the object id of the liked object
         likeable:{
            type:mongoose.Schema.ObjectId,
            required:true,
            refPath:'onModel'
         },
         //This field is used for defining the type of the liked object since this is a dynamic reference
         onModel:{
            type:String,
            required:true,
            enum:['Post','Comment']
         }
        }, {
            timestamps:true
         }
);
const Like=mongoose.model('Like',likeschema);
module.exports=Like;
