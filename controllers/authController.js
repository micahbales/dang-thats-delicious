const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');
const mail = require('../handlers/mail');

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

exports.forgot = async (req, res) => {
  // 1. see if user exists
  const user = await User.findOne( { email: req.body.email });
  if (!user) {
    req.flash('info', 'If an account with this email exists, you should be receiving a reset message shortly');
    res.redirect('/login');
  }
  // 2. set reset tokens and expiry on account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // one hour in milliseconds
  await user.save();
  // 3. send them email with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  await mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset'
  });
  req.flash('info', `If an account with this email exists, you should be receiving a reset message shortly`);
  // 4. redirect to login page after token has been sent
  res.redirect('/login');
};

exports.reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token, // find user with matching token
    resetPasswordExpires: { $gt: Date.now() } // which hasn't expired
   });
   if (!user) {
     req.flash('error', 'The password reset token is invalid or has expired');
     res.redirect('/login');
   }

   // if there is a user, show reset password form
   res.render('reset', { title: 'Reset Your Password' });
};

exports.confirmedPasswords = (req, res, next) => {
  if (req.body.password === req.body['password-confirm']) {
    next(); // keep it going
    return;
  }
  req.flash('error', 'Passwords do not match. Try again')
  res.redirect('req.originalUrl'); // We could also use `res.redirect('back');`
};

exports.update = async (req, res) => {
  // This could could be refactored into a middleware if desired
  const user = await User.findOne({
    resetPasswordToken: req.params.token, // find user with matching token
    resetPasswordExpires: { $gt: Date.now() } // which hasn't expired
   });
   if (!user) {
     req.flash('error', 'The password reset token is invalid or has expired');
     res.redirect('/login');
   }

   const setPassword = promisify(user.setPassword, user);
   await setPassword(req.body.password);
   user.resetPasswordToken = undefined;
   user.resetPasswordExpires = undefined;
   const updatedUser = await user.save();

   await req.login(updatedUser); // use Passportjs to auto-login user
   req.flash('success', 'Your password has been successfully reset!');
   res.redirect('/');
};
