const express=require('express');
const bodyParser=require('body-parser');
const con=require('./db');
const upload=require('express-fileupload');


var app=express();
app.use(upload());

var path=require('path');
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended:true
}));


app.listen(3000,(request,response)=>{
  console.log("server started");
});

app.get('/',(request,response)=>{
response.render('index');
});

app.post('/UploadAction',(request,response)=>{
  console.log(request.files);
if(request.files){
  var desc=request.body.desc;
var file=request.files.filename;
var fname=file.name;
file.mv('./upload/'+fname,function(err){
  if(err) throw err;
  else{
var sql="insert into FileMaster(fname,description) values('"+fname+"','"+desc+"')";
         con.query(sql,function(err){
           if(err) throw err;
           else
             response.render('index',{msg:'Uploaded Successfully'});
         });
      }
});

}

});

app.use(express.static('upload'));

app.get('/ViewImage',(request,response)=>{
  var sql="select * from FileMaster";
           con.query(sql,function(err,result){
             if(err) throw err;
             else
               response.render('viewimage',{results:result});
           });
});
