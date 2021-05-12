const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{type : String,required :[true,"username required!!"]},
    count:{type:Number,default:0},
    
    
});

module.exports=UserModel=mongoose.model("usermodel",userSchema);