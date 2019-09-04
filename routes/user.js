const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');

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

};
