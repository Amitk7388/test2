    const mongo = require('mongodb');
    const mongoose = require('mongoose')
    var db = mongoose.connection;
module.exports = {
   databaseConnection : mongoose.connect('mongodb://localhost/whms'),
   secret : 'secret'
}