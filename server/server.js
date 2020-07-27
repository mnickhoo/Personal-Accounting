//---- Config
process.env.NODE_CONFIG_DIR = __dirname + '/config';

const config = require('config');
const {user} = require('./model/user');
const express = require('express');
const morgan = require('morgan');
const helemt = require('helmet');
const winston = require('winston');
const fs = require('fs');
const path = require('path');
const persianDate = require('persian-date');
const {authenticate} = require('./middleware/authenticate');
const _ = require('lodash');


console.log(`*** ${String(config.get('Level')).toUpperCase() } *** `);


const app = express();
const requestLogger = fs.createWriteStream(path.join(__dirname, 'log/requests.log'));
  
const logger = winston.createLogger({
    transports : [
        new winston.transports.Console(),
        new winston.transports.File({filename : path.join(__dirname , '/log/server-status.log')})
    ]
});
persianDate.toLocale('en');
const date = new persianDate().format('YYYY/M/DD');
//use middlewares
app.use(express.json());
app.use(helemt());
app.use(morgan('combined' , {stream : requestLogger}));


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
app.post('/api/login' , authenticate , async (req,res)=>{
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


app.post('/api/payment' , authenticate , async (req,res)=>{
    try {
        const body = _.pick(req.body , ['info','amount']);
        let user = await user.findOneAndUpdate({
            _id : req.user._id 
        },
        {
            $push : {
                payment : {
                    info : body.info , 
                    amount : body.amount,
                    date 
                }
            }
        });
        if(!user){
            return res.status(404).json({
                "error" : "user not found"
            })
        }
        res.status(200).json({
            "message" : "payment has been saved!"
        });

    } catch (error) {
        res.status(400).send("somthing went wrong!");
    }
})

app.get('/api/version', (req,res)=>{
    console.log("ok!")
    res.status(200).send("ok!");
} , err =>{
    res.status(400).send(err);
})

app.listen(config.get('PORT') , ()=>{
    // logger.log({
    //     Level : "info" , 
    //     message : `Server is running on port ${config.get('PORT')}`
    // });
    logger.info(`Server is running on port ${config.get('PORT')}`);
    console.log(date);
})