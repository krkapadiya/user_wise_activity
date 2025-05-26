const mongoose=require('mongoose');

const activityschema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    activity_name:{
        type:String
    }
},{timestamps:true,versionKey:false})

module.exports=mongoose.model('activities',activityschema)