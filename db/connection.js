const mongoose=require("mongoose");

var user="dks";
var password="atlasExerciseTracker";
var database="rolecall";

// for mongo atlas ......use below link.........use below link(un-comment it)
const URI=`mongodb+srv://${user}:${password}@exercisetrackercluster.novns.mongodb.net/${database}?retryWrites=true&w=majority`;

// for mongodb running on local-host ......use below link(un-comment it)
//const URI=`mongodb://localhost/${database}`

const connectDB=async()=>{

    await mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true});
    console.log("db connected !!");
    
}

module.exports=connectDB;