//---- Config
process.env.NODE_CONFIG_DIR = __dirname + '/config';

const config = require('config');
const {user} = require('./model/user');
const express = require('express');
const _ = require('lodash');


console.log(`*** ${String(config.get('Level')).toUpperCase() } *** `);


const app = express();

app.listen(3000 , ()=>{
    console.log(`server is running on port ${config.get('PORT')}`)
})

//use middleware
app.use(express.json);
//request on address /api/users
app.post('/api/users' , (req,res)=>{
    const body = _.pick(req.body , ['fullname','email','password']);
    console.log(body);
    let newUser = user(body);
    user.save().then(user =>{
        res.status(200).send(user);
        res.body
    } , err =>{
        res.status(400).json({
            "error" : "somthing went wrong!"
        })
    })
})

app.get('/api/version', (req,res)=>{
    res.status(200).send("ok!");
} , err =>{
    res.status(400).send(err);
})