const express = require('express');
const router = express.Router();
const passport = require('passport');

// /auth/*
// Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// Google callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});



// Facebook login
router.get('/facebook', passport.authenticate('facebook'));

// Facebook redirect 
router.get('/facebook/redirect', passport.authenticate('facebook'), (req, res) => {
  res.redirect('/profile');
});




// Logout 
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;