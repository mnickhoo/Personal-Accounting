const validator = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');

const tokenOptions = {
    type : String , 
    require : true
};
//--use mongoose
const {mongoose} = require('../../db/mongoose');

let userSchema = new mongoose.Schema({
    fullname : {
        type : String,
        require : true,
        trim : true , 
        minlength : 3
    },
    email: {
        type : String , 
        require : true,
        unique : true,
        minlength : 6,
        validate : {
            validator : validator.isEmail , 
            message :  `{value} is not a valid email.`
        }
    },
    password: {
        type : String , 
        minlength : 6 , 
        require : true
    },
    tokens : [{
        access : tokenOptions,
        token :tokenOptions 
    }]
});

userSchema.statics.findbyCredentials = function(email , password){
    let user = this;
    return user.findOne({
        email 
    }).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        return new Promise((resolve , reject)=>{
            bcrypt.compare(password , user.password , (err , res)=>{
                if(res){
                    resolve(res);
                }else{
                    reject();
                }
            });
        });
    })
}

userSchema.methods.toJSON = function(){
    let user = this ; 
    let userObject = user.toObject();
    return _.pick(userObject,['_id','fullname','email'])
};

userSchema.pre('save' , function(next){
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10 , (err,salt)=>{
            bcrypt.hash(user.password , salt , (err, hash)=>{
                user.password = hash ; 
                next();
            });
        });
    }else{
        next();
    }
});

userSchema.methods.generateAuthToken = function(){
    let user = this; 
    let access = 'auth' ; 
    let token = jwt.sign({
    _id : user._id.toHexString(),
    access 
    }, config.get('JWT_SECRET').toString())

    user.tokens.push({
        access , 
        token
    })
    return user.save().then(()=>{
        return token ;
    })
}

//define user model
let user = mongoose.model('user' , userSchema);

module.exports = {
    user
}