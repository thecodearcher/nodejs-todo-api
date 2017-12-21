const express =require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var app = express();
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log(req.body);
    var todo = new Todo({
        text:req.body.text
    });

    todo.save().then((result)=>{
        res.send(result);
    }).catch(e=>{
        res.send(e);
    });
});

app.get('/todos',(req,res)=>{

});

app.listen(3000,()=>{
    console.log('Server Started');
});

module.exports = {app};