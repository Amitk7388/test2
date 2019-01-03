const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const sessions = require('express-sessions');
const expressValidator = require('express-validator');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const connection = require('./config/connection');

const jwt =require('jsonwebtoken')
const passport = require('passport')

require('./config/passport')(passport);


// const cluster = require('cluster');
// const http = require('http');
// const os = require('os')


// console.log(os.type()); // "Windows_NT"
// console.log(os.release()); // "10.0.14393"
// console.log(os.platform());

// const getMac = require('getmac')
// const getos = require('getos')
// const os = require('os')


var indexRouter = require('./routes/signup');
var usersRouter = require('./routes/login')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
// this for the passport using local Strategy 
// app.use(express.session({secret : 'cat'}))
app.use(bodyParser.urlencoded({ extended: false }));
// this is for the passport authenticate
app.use(passport.initialize());
app.use(passport.session())


app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter).databaseConnection;
app.use(usersRouter).databaseConnection;


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// if(cluster.isMaster){
//   console.log('master' + process.id + 'is running')
// }



const PORT = process.env.PORT || 9063
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}).listen(PORT, console.log('Server is working on the PORT ' + PORT));


// getMac.getMac(function(err, macAddress){
//   if (err)  throw err
//   console.log('this is macAddress' + macAddress)
// })



// getos(function(e,os) {

//   if(e) return console.log(e)
//   console.log(os)
// })

module.exports = app;




