const mongoose = require('mongoose');
const config = require('config');

mongoose.Promise = global.Promise;

mongoose.connect(config.get('MONGOURL') , {useNewUrlParser: true});

module.exports = {
    mongoose
}