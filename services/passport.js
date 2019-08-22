const colors = require('colors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('users');

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findOne({ _id: id })
  .select('-_id email')
  .then(user => {
    cb(null, user);
  })
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, cb) => {
    User.findOne({ email })
    .then(user => {
      if (!user) return cb(null, false);
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) return cb(null, false);
        return cb(null, user);
      });
    });
}));