var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;



const passport = require('passport');

var User = require('../models/user')
var config = require('../config/connection')

module.exports = function(passport){
    console.log('passport function is working')
    var opts = {}

    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log('this is jwt' + jwt_payload)
        User.getUserByID(jwt_payload._doc._id, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                console.log('passport jwt user'+ user)
                return done(null, user);
            } else {
                return done(null, false);
                // or you could create a new account
            }
        });
    }))

}
