const {user} = require('./../model/user');

let authenticate = (req,res,next) =>{
    let token = req.header('x-auth');
    user.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err)=>{
        res.status(401).send();
    })
}

module.exports = {
    authenticate
} 