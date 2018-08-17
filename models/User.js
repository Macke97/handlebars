const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: String,
  thumbnail: String
});

module.exports = User = mongoose.model('User', userSchema);