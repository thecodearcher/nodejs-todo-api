const { ObjectID } = require('mongodb'); 

const express =require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/todo');
var {User} = require('./model/user');

var port = process.env.PORT || 3000;
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
ju = '349822552';
app.get('/todos',(req,res)=>{
    Todo.find({})
    .then((todos)=>{
        res.send({
            todos
        });
    }).catch(e=>res.send(e));
});

app.get('/todos/:id',(req,res)=>{

    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404)
        .send();
    }
    
    Todo.findById(id)
    .then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch(e=>res.status(400).send());
});

app.delete('/todos/:id',(req,res)=>{

    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404)
        .send();
    }
    
    Todo.findByIdAndRemove(id)
    .then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({
            todo
        });
    }).catch(e=>res.status(400).send());
});

app.listen(port,()=>{
    console.log('Server Started On Port ' + port);
});

module.exports = {app};