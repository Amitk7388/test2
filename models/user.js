const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    name :{
        type: String,
        index : true,
        required : true,
        min : 5,
        max : 20
    },
    email : {
        type: String,
        required : true,
        min : 5,
        max : 20
    },
    department: {
        type : String,
        required : true,
        min : 5,
        max : 20
    },
    password : {
        type : String,
        required : true,
        bcrypt : true,
        min : 5,
        max : 20
        
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },

})

var User = module.exports = mongoose.model('user', userSchema);

// this saving the newuser data to database for signup purpose
module.exports.createUser = function(newUser, cb){
    console.log('this is model newUser'+ newUser)
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err){
            return status(401)
            .json({status:false, 
                response : err + 'please try again', 
                devMessage: 'there is some error while hasing the password'})
        }
        else if(!hash){
            return status(401)
            .json({status:false, 
                response:'there is some issue, please try again'})
        }else{
            newUser.password = hash
            console.log(hash)
            newUser.save(cb)
        }
    })
}

//finding the details through user id
module.exports.getUserByID = function(id, cb){
    User.findById(id,cb)
}

// finding the details by email
module.exports.getUserByEmail = function(email, cb){
    User.findOne({email:email}, cb)
}

// comparing the hasing password from database
module.exports.comparePassword = function(password, hash, cb){
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err){
            return json({status:false, 
                response:err, 
                devMessage:'there is some issue while matching the password'})
        }
        else{
            cb(null, isMatch)
        }
    });
} 