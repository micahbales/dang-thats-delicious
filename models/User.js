const mongoose = require('mongoose');
const schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid email address'],
    required: 'Please supply an email address'
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true
  }
});

// handle password/authentication
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// make mongoDB errors pretty for user consumption
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema);
