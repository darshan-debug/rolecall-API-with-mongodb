const mongoose=require("mongoose");

const exerciseSchema=new mongoose.Schema({
        _userid:{type:mongoose.Types.ObjectId,required:true},
        description: {type:String,required:[true,"Path `description` is required."]}, 
        duration:  { type: Number, min: [1, 'duration too short'] ,required:[true,"Path `duration` is required."]},
        date: { type: Date }
        
});

module.exports=ExerciseModel=mongoose.model("exercisemodel",exerciseSchema);