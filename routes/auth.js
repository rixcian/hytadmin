const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = mongoose.model('users');

module.exports = app => {
  app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(409).send({ success: false, err: 'Uživatel s touto emailovou adresou již existuje.' });

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return res.status(500).send({ success: false, err: 'Vnitřní chyba serveru.' });
      await new User({ email, password: hash }).save();
      res.status(201).send({ success: true, err: null });
    });
  });

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/');
  })

  app.get('/api/current_user', (req, res) => {
    res.send(req.user);
  })
}