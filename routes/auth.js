const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = mongoose.model('users');

module.exports = app => {
  app.post('/api/register', async (req, res) => {
    const { email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(409).send({ err: 'Uživatel s touto emailovou adresou nebo jménem již existuje.' });

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return res.status(500).send({ err: 'Vnitřní chyba serveru.' });
      await new User({ email, username, password: hash }).save();
      res.status(201).send({ err: null });
    });
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { return res.status(401).send(info); }
      req.login(user, (err) => {
        if (err) { console.log('login err'); return next(err); }
        return res.send(user);
      })
    })(req, res, next)
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.status(200).send();
  });

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  });
};