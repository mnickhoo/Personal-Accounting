const validator = require('validator');
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
    }  
})

//define user model
let user = mongoose.model('user' , userSchema);

module.exports = {
    user
} 