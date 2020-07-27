//---- Config
process.env.NODE_CONFIG_DIR = __dirname + '/config';

const config = require('config');
const {user} = require('./model/user');
const express = require('express');
const _ = require('lodash');


console.log(`*** ${String(config.get('Level')).toUpperCase() } *** `);


const app = express();

//use middleware
app.use(express.json());

//request on address /api/users
app.post('/api/users' , async (req,res)=>{
    try {
        const body = _.pick(req.body , ['fullname','email','password']);
        let newUser = user(body);
        await newUser.save();
        res.status(200).send(newUser);
    } catch (err) {
        res.status(400).json({
            "error" : `somthing went wrong! ${err}`
        })
    }
});

//login Section API
app.post('/api/login' , async (req,res)=>{
    try{
    const body = _.pick(req.body , ['fullname' , 'email' , 'password']);

    let uerResult = await user.findbyCredentials(body.email , body.password);
    let token = await uerResult.generateAuthToken();
    res.header('x-auth', token)
                .status(200)
                .send(token);
    }catch(err){
        res.status(400).json({
           Error: `Something went wrong. ${err}`
        });
    }
});


app.get('/api/version', (req,res)=>{
    console.log("ok!")
    res.status(200).send("ok!");
} , err =>{
    res.status(400).send(err);
})

app.listen(3000 , ()=>{
    console.log(`server is running on port ${config.get('PORT')}`)
})