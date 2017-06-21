const passport = require('passport');

exports.login = passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: 'Failed Login!',
  successRedirect: '/',
  successFlash: 'You are now logged in!'
});

exports.logout = (req, res) => {
  req.logout();
  req.flash('You have logged out!');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
  // check if the user is authenticated
  if(req.isAuthenticated()) {
    next(); // carry on; they are logged in!
    return;
  }
  req.flash('error', 'Oops! You must be logged in');
  res.redirect('/login');
};
