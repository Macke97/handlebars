const express = require('express');
const router = express.Router();
const passport = require('passport');

// /auth/*

router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}));

// Google callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  console.log(req.user)
  res.redirect('/profile');
});

// Logout 
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;