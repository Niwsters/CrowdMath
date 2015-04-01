var LocalStrategy = require('passport-local').Strategy;

var User = require('../app/models/user');

module.exports = function(passport) {
  
  // passport session setup =================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session
  
  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  // LOCAL SIGNUP =============
  
  passport.use('local-signup', new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    }, 
    function(req, email, password, done) {
      process.nextTick(function() {
        User.findOne({ 'email' : email }, function(err, user) {
          if (err)
            return done(err);
          
          // check to see if there's already a user with that email
          if(user) {
            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
          } else {
            var newUser = new User();
            
            newUser.username = req.body.username;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            
            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        });
      });
    }
  ));
  
  passport.use('local-login', new LocalStrategy(
    {
      usernameField : 'email',
      passwordField: 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({ 'email' : email }, function(err, user) {
        if (err)
          return done(err);
        
        if(!user)
          return done(null, false, req.flash('loginMessage', 'No user found.'));
        
        if(!user.validPassword(password))
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
        
        return done(null, user);
      });
    }
  ));
}