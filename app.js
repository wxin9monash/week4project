let mongodb = require('mongodb');
let MongoDBClient = mongodb.MongoClient;
let express = require('express');
let bodyParser = require('body-parser');
let app = express();


let db = null; //database
let col = null; //collection(i.e. table)
app.use(bodyParser.urlencoded({extended:false}));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('css'));
app.use(express.static('img'));
let url = "mongodb://localhost: 27017";

MongoDBClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true}, function(err,client){
    if (err) {
        console.log('Err  ', err);
    } else {
        console.log("Connected successfully to server");
        db = client.db("fit2095db");
        col = db.collection('week6table');
    }
    // db = client.db("fit2095db");
    // col = db.collection('week6table');
    // col.insertOne({maker:'BMW',year:1998});
});

// var db=[];
var filePath=__dirname+"/views/";

app.get('/', function (req, res) {
    let fileName=filePath+"index.html"
    res.sendFile(fileName);
    
});

app.get("/addtask",function(req,res){
    let fileName=filePath+"addtask.html"
    res.sendFile(fileName);
    // res.redirect('/');
});

app.get('/listtask', function (req, res) {
    col.find({}).toArray(function (err,data){
        res.render('listtask',{mydata: data});
    });
});

app.post('/addtask', function (req, res) {
    let newData = {id:(Math.floor(Math.random() *10000) +1), name:req.body.tname, person: req.body.tperson, date: req.body.tdate, description:req.body.tdescription, status:req.body.tstatus}
    col.insertOne(newData);
    // console.log(req.body.tname);
    res.redirect('/');
});

app.get('/gettasks', function(req,res){
    col.find({}).toArray(function (err,data){
        res.render('listusers',{mydata: data});
    });
})

app.get('/deletetask', function(req,res){
    let fileName=filePath+"deletetask.html"
    res.sendFile(fileName);
})

app.post('/deletetaskdata',function(req,res){
    let query = {id: parseInt(req.body.tid)};
    col.deleteMany(query,function(err,obj){
        console.log(obj.result);

        // col.find({}).toArray(function(err,data){
        //     res.send(data);
        // });
    });
    res.redirect('/listtask');
});

app.get('/updatetask', function(req,res){
    let fileName=filePath+"updatetask.html"
    res.sendFile(fileName);
});

app.post('/updatetaskdata',function(req,res){
    let querybody = req.body;
    let filter = {id: parseInt(querybody.tid)};
    let theUpdate = {$set:{status: querybody.tNstatus}};
    col.updateOne(filter, theUpdate);
    res.redirect('/listtask')
});

app.get('/noSamLee',function(req,res){
    let query1 = {person: "Sam"}
    let query2 = {person: "Lee"}

    let theUpdate = {$set:{person: "Anna", status: "In_progress"}};
    col.updateOne(query1,theUpdate);
    col.updateOne(query2,theUpdate);
    res.redirect('/listtask')
});

app.get('deletecomplete',function(req,res){
    let query = {status: "complete"}
    col.deleteMany(query,function(err,obj){
        console.log(obj.result);
    });
    res.redirect('/listtask');
    
})

app.listen(8080);

