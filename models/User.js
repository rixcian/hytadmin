const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

mongoose.model('users', UserSchema);