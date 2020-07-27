const {user} = require('./../model/user');

let authenticate = (req,res,next) =>{
    let token = req.header('x-auth');
    user.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        console.log(user);
        res.status(200).send(user);
        req.user = user;
        req.token = token;
        next();
    } , (err) =>{
        res.status(401).send(err);
        console.log(err);
    })
    

}

module.exports = {
    authenticate
} 