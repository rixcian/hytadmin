const colors = require('colors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id)
  .then((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  })
});

passport.use(new LocalStrategy(
  (email, password, cb) => {
    User.findOne({ email })
    .then((err, user) => {
      if (err) return cb(err);
      if (!user) return cb(null, false);
      if (user.password !== password) return cb(null, false);
      return cb(null, user);
    });
}));