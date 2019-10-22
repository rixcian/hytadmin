const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = mongoose.model('User');
const nodemailer = require('nodemailer');
const generator = require('generate-password');
const pass = require('../config/keys').password;


const sendPasswordResetEmail = (email, newPassword) =>
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'ricianelf@gmail.com',
        pass
      }
    });

    const mailOptions = {
      from: '"CeskyHytale.cz" <rostislav.kremecek@gmail.com>',
      to: email,
      subject: 'Zapomenuté heslo',
      html: `Nové heslo: <b>${ newPassword }</b>`
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });


module.exports = app => {


  app.post('/api/register', async (req, res) => {
    const { email, username, role, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) return res.status(409).send({ err: 'Uživatel s touto emailovou adresou nebo jménem již existuje.' });

    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) return res.status(500).send({ err: 'Vnitřní chyba serveru.' });
      await new User({ email, username, role, password: hash, avatarPath: "/api/uploads/avatars/default/default_avatar.png" }).save();
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


  app.post('/api/password-reset', (req, res) => {
    const { email } = req.body;

    User.findOne({ email })
    .then(user => {
      if (!user) return res.status(404).send({ err: 'Uživatel s touto emailovou adresou neexistuje.' });

      const newGeneratedPassword = generator.generate({
        length: 10,
        numbers: true
      });

      bcrypt.hash(newGeneratedPassword, 10, async (err, hash) => {
        if (err) return res.status(500).send({ err: 'Vnitřní chyba serveru.' });
        user.password = hash;
        await user.save();

        sendPasswordResetEmail(email, newGeneratedPassword)
          .then(() => res.status(204).send())
          .catch(err => res.status(500).send({ err }));

      });
    })
    .catch(err => res.status(500).send({ err }));
  })


};