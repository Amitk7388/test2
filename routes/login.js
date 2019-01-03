const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const config = require('../config/connection')

const passportJwt = require('passport-jwt')

require('../config/passport')
/* GET users listing. */


router.get('/login', function(req, res, next) {
  res.render('login', {
    title: 'Login'
  });
});


router.post('/login', function(req, res, next){


  console.log('login function is working')
  var email = req.body.email;
  var password = req.body.password;
  console.log(req.body)
  req.checkBody('email', 'please enter the email id').notEmpty().isEmail();
  req.checkBody('password', 'please enter the password').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.status(500)
    .json({status:false, 
      response:errors, 
      devMessage: 'there is some is by filtering the user data'})
  }else{
    User.getUserByEmail(email, function(err, user){
      console.log('this is user' + user)
      if(err){
        res.status(500)
        .json({status: false, 
          response: err, 
          devMessage: 'there is some issue while finding the user email'} )
      }
      if(!user){
        res.status(401)
        .json({status:false, 
          response:'the email id you have entered is false. Please enter the correct email id '})
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err){
          res.status(500)
          .json({status:false, 
            response:err, 
            devMessage:' there is some issue while comparing the password. please try again'})
        }
        else if (!isMatch){
          res.status(401)
          .json({status:false, 
            response: 'please eneter the correct password'})
        }else{
          var token = jwt.sign({data : user}, 
            config.secret,
            {expiresIn: 600000});
          res.status(200)
          .json({status: true,
                                token : 'jwt ' + token,
                                newUser : user,
                                user: {id: user._id,
                                       email : user.email,
                                       password: user.password }})
        }
      })
    })
  }
})

router.get('/profile', passport.authenticate('jwt', {session:false}), function(req, res){
  console.log('yes this profile is working')
  console.log(user)
  res.status(201)
  .json({status:true, 
    response:req.user,
    devMessage: 'sucessfully user logedin'})
})

router.post('/logout', function(req, res){
  req.logout();
  res.send('Sucessfully you loged out. Thank you for using this app')
})


module.exports = router;
