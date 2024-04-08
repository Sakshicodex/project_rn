const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  token: { type: String },
  otp: { type: String },
  resetToken: { type: String }, 
  
});


module.exports = mongoose.model('User', userSchema);