const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // Removes leading/trailing whitespace
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate email addresses
    lowercase: true, // Converts email to lowercase
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // Regex for email validation
      'Please fill a valid email address',
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensures a minimum password length
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
