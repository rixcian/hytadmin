const requireLogin = require('../middlewares/requireLogin');
const requireAdmin = require('../middlewares/requireAdmin');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = mongoose.model('User');
const Article = mongoose.model('Article');

module.exports = app => {

  app.get('/api/users/:skip/:limit', requireLogin, async (req, res) => {

    const { skip, limit } = req.params;

    const editors = await User.find({ role: 'redaktor' })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .select('_id username email role createdAt active')
      .exec();

    const allEditorsCount = await User.countDocuments({ role: 'redaktor' });

    res.status(200).send({ allEditorsCount, editors });

  });

  app.get('/api/users/:editorID', requireLogin, async (req, res) => {

    const { editorID } = req.params;

    const editor = await User.findOne({ _id: editorID }).select('-_id -__v -password');
    if (!editor) return res.status(404).send({ err: 'Redaktor nebyl nalezen v databázi' });

    const allArticlesCount = await Article.find({ author: editorID }).countDocuments();

    res.send({ allArticlesCount, editor });

  });

  app.put('/api/account/password', requireLogin, (req, res) => {
    const { oldPassword, newPassword } = req.body;

    User.findOne({ _id: req.user._id })
      .then(user => {
        if (!user) return res.status(500).send({ err: 'Vnitřní chyba serveru' });

        bcrypt.compare(oldPassword, user.password, (err, success) => {
          if (!success) return res.status(403).send({ err: 'Zadali jste špatné heslo.' });

          bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) return res.status(500).send({ err: 'Vnitřní chyba serveru.' });
            user.password = hash;
            await user.save();
            res.status(204).send();
          });
        });

      })
      .catch(err => res.status(500).send({ err }))
  });

  app.put('/api/account/email', requireLogin, (req, res) => {
    const { email } = req.body;

    // We're checking if it's not existing another user with that new email
    User.findOne({ email })
      .then(user => {
        if (user) return res.status(403).send({ err: 'Uživatel s tímto emailem již existuje.' });

        // We're finding logged user and changing email address
        User.findOne({ _id: req.user._id })
          .then(async user => {
            if (!user) return res.status(500).send({ err: 'Vnitřní chyba serveru' });
            user.email = email;
            await user.save();
            res.status(204).send();
          })
          .catch(err => res.status(500).send({ err }));

      })
      .catch(err => res.status(500).send({ err }));
  });

  app.delete('/api/users/:editorID', requireLogin, requireAdmin, (req, res) => {
      const _id = req.params.editorID;

      User.findOneAndDelete({ _id })
          .then(() => {
              res.status(204).send();
          })
          .catch(() => {
              res.status(404).send({ err: 'Redaktor nebyl v databázi nalezen' });
          });
  });

};
