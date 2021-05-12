const express=require("express");
var bodyParser=require('body-parser');
const app=express();
var path = require('path');
app.use(bodyParser.urlencoded({extended:false}));
const connectDB=require("./db/connection.js");
const UserModel=require("./db/usermodel");
const ExerciseModel=require("./db/exercisemodel");
app.use(express.static(path.join(__dirname,'./public')));
//////////////////////////////////////////////////////////////////

connectDB();
app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/views/index.html'); 
  res.sendFile(path.join(__dirname,"/views/index.html")); 
});

app.get('/api/users', (req, res) => {  
  var anss=[];  
  UserModel.find((e,op)=>{
    if(e || op===null){res.status(200).send(anss);}
    else{op.forEach(({username,_id})=>anss.push({username,_id}))
    res.status(200).send(anss);
    }
  });  
});

app.post("/api/users",(req, res) => {
  var value=req.body;     
    
    UserModel.findOne({username:req.body.username},async(ee,op1)=>{
      if(op1===null){
            var obj=new Object();
            obj.username=req.body.username;
            let newUser=new UserModel(obj);
            await newUser.save((e,op)=>{
              if(e){res.status(500).send(e.message);}
              else{res.status(200).json(op);}
            });
      }
      else{res.status(403).send(`Username already taken!! (_id:  ${op1._id})`);}
    });
    
});
app.post("/api/users/:_id/exercises",(req, res) => {
 // console.log(req.body);
 // console.log(req.params);
  var value=req.body;

  var obj=new Object();  
  obj.description=value.description;
  obj._userid=req.params._id;
  obj.duration=parseInt(value.duration);
  if(!value.date){obj.date=new Date();}
  else{obj.date=new Date(value.date);}
  let  exercise=new ExerciseModel(obj);
  UserModel.findById(req.params._id,(e,op)=>{
    if(e || op===null){res.status(404).send("invalid _id !!");}
    else{      
      exercise.save((e1,op2)=>{
          if(e1 || op2===null){if(e1){res.status(400).send(e1.message);}else{res.status(500).send("error while saving to db!!");}}
          else{obj.username=op.username;  // for output purpose  
              obj._id=op2._id;              
              op.count+=1;
              op.save();
              res.status(200).send(obj);
          }
      });
    }
  });
    
});

app.get('/api/users/:_id/logs', (req, res) => {
  //res.sendFile(__dirname + '/views/index.html'); 
  var obj=new Object();
  var loggs;
  UserModel.findById(req.params._id,(e,op)=>{
    if(e || op===null){res.status(404).send("_id not found in database!!");}
    else{
      ExerciseModel.find({_userid:req.params._id},(e1,op2)=>{
        if(e1 || op2===null){res.status(500).send(`error ,while accessing exercise logs for _id: ${op._id}`);}
        else{
          obj._id=op._id;obj.username=op.username;obj.count=op.count;loggs=op2;
          // console.log(op);
          // console.log(op2);
          // console.log(obj);
          // console.log(loggs);
          if(Object.keys(obj).length === 0){res.status(404).send(`Cast to ObjectId failed for value "${req.params._id}" at path "_id" for model "Users"`);}
          else{
            obj.log=[];
            //console.log(obj);
            if(Object.keys(req.query).length !== 0){
                      console.log(req.query);
                      var {from,to,limit}=req.query;
                      console.log({from,to,limit});
                      if(typeof(from)==="undefined"){
                            if(typeof(to)==="undefined"){ 
                                    if(typeof(limit)!=="undefined"){
                                      limit=parseInt(limit);
                                      if(obj.count<limit){obj.log=loggs;console.log("cc");}
                                      else{obj.count=limit;for(var i=0;i<limit;i++){obj.log.push(loggs[i]);}console.log("dd");}        
                                    }else{obj.log=loggs;console.log("ee");}


                            }
                            else {
                              to=new Date(to);
                              to=to.getTime();
                              dispObj=[];
                              for(var i=0;i<loggs.length;i++){ if(loggs[i].date.getTime()<=to){dispObj.push(loggs[i]);}          }
                              if(typeof(limit)!=="undefined"){
                                          limit=parseInt(limit);
                                          if(dispObj.length<limit){obj.log=dispObj;obj.count=dispObj.length;console.log("cc1");}
                                          else{obj.count=limit;for(var i=0;i<limit;i++){obj.log.push(dispObj[i]);}console.log("dd1");} 
                              }
                              else{obj.log=dispObj;obj.count=dispObj.length;console.log("ee1");}

                            }

                      }
                      ////
                      else{
                        from=new Date(from);
                        from=from.getTime();
                        temp=[]
                        for(var i=0;i<loggs.length;i++){ if(loggs[i].date.getTime()>=from){temp.push(loggs[i]);}          }
                        loggs=temp

                        if(typeof(to)==="undefined"){ 
                          if(typeof(limit)!=="undefined"){
                            limit=parseInt(limit);
                            if(loggs.length<limit){obj.log=loggs;obj.count=loggs.length;console.log("cc2");}
                            else{obj.count=limit;for(var i=0;i<limit;i++){obj.log.push(loggs[i]);}console.log("dd2");}        
                          }else{obj.log=loggs;obj.count=loggs.length;console.log("ee2");}


                        }
                        else {
                          to=new Date(to);
                          to=to.getTime();
                          dispObj=[];
                          for(var i=0;i<loggs.length;i++){ if(loggs[i].date.getTime()<=to){dispObj.push(loggs[i]);}          }
                          if(typeof(limit)!=="undefined"){
                                      limit=parseInt(limit);
                                      if(dispObj.length<limit){obj.log=dispObj;obj.count=dispObj.length;console.log("cc3");}
                                      else{obj.count=limit;for(var i=0;i<limit;i++){obj.log.push(dispObj[i]);}console.log("dd3");} 
                          }
                          else{obj.log=dispObj;obj.count=dispObj.length;console.log("ee3");}

                        }

                      }
            }
            else{
              
              obj.log=loggs;
            }
            res.status(200).send(obj);

          }

        }

      });
    }
  });
  
  
 
});







// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })
var pport=(process.env.PORT || 3000);
  app.listen(pport, function(){
    console.log(`server is listening on port: ${pport}` );
  });