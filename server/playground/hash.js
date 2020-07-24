const bcrypt = require('bcryptjs');

// //generate salt 
// let salt = bcrypt.genSaltSync(10);
// console.log(salt);
// let hash = bcrypt.hashSync('123456' , salt);
// console.log(hash);

let password = '1234556';
let hashPassword = '$2a$10$lp5uY4EYjSWm275kgabLAOdnh3pQAYorGQHh9Eurr0vj/I8zEsOEi'
bcrypt.genSalt(10 , (err , salt) =>{
    bcrypt.hash(password , salt, (err , hash) =>{
        console.log(hash);
    });
});


bcrypt.compare(password , hashPassword , (err , result) =>{
    console.log(result);
});