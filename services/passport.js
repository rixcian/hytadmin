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
  .select('_id email username')
  .then(user => {
    cb(null, user);
  })
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  (email, password, done) => {
    User.findOne({ email })
    .select('_id email username password')
    .then(user => {
      if (!user) return done(null, false, { email: 'Uživatel s touto emailovou adresou není zaregistrován' });
      bcrypt.compare(password, user.password, (err, res) => {
        if (!res) return done(null, false, { password: 'Zadali jste špatné heslo' });
        user = user.toObject();
        delete user.password;
        return done(null, new User(user));
      });
    });
}));