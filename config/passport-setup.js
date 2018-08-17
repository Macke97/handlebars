const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/User');


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

const googleRedirectURL = process.env.NODE_ENV === 'production' ? 'https://handlebars-testing.herokuapp.com/auth/google/redirect' : '/auth/google/redirect';
passport.use(new GoogleStrategy({
  // Options for the google strategy
  clientID: keys.google.clientID,
  clientSecret: keys.google.clientSecret,
  callbackURL: googleRedirectURL
}, (accessToken, refreshToken, profile, done) => {
  // Passport callback, what to do when on redirect URI
  
  // Check if user already exists in DB
  User.findOne({googleId: profile.id}).then(currentUser => {
    if(currentUser) {
      console.log('Current user:', currentUser);
      done(null, currentUser);
    } else {
      // Create new user
      new User({
        username: profile.displayName,
        googleId: profile.id,
        thumbnail: profile._json.image.url
      })
      .save()
      .then(newUser => {
        done(null, newUser);
      });
    }
  });
}));