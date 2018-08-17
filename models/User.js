const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: String,
  facebookId: String,
  thumbnail: String,
  registered: {
    type: Date,
    default: Date.now
  },
  email: String
});

module.exports = User = mongoose.model('User', userSchema);