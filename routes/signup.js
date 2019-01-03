var express = require('express');
var router = express.Router();

var User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/', function(req, res, next){

  console.log(req.body);

  let name = req.body.name;
  let email = req.body.email;
  let department = req.body.department;
  let password = req.body.password;

  console.log('validation')
  req.checkBody('name', 'please fill the name').notEmpty()
  req.checkBody('email', 'please fill the email id ').notEmpty().isEmail();
  req.checkBody('department', 'please fill the department').notEmpty();
  req.checkBody('password', 'please fill the password').notEmpty();
  console.log('validation complete')

  var errors = req.validationErrors();

  if(errors){
    console.log('here is issue')
    res.status(500).json({status:false, response: errors, devMessage: 'there is some issue while creating the user data'})
  }else{
    console.log('here is issue1')
    var newUser = new User({
      name : name,
      email : email,
      department : department,
      password : password
    })
    console.log(newUser)
    User.createUser(newUser, function(err, createdUser){
      if(err){
        res.status(401).json({status :false, response:err, devMessage : 'there is some while creating user'})
      }else{
        res.status(201).json({status: true, response: createdUser})
      }
    })
  }
})


module.exports = router;
