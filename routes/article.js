const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');

const Article = mongoose.model('Article');

module.exports = app => {

  app.post('/api/articles', requireLogin, async (req, res) => {

    const { title, content, thumbnailImagePath, coverImagePath } = req.body;
    
    await new Article({
      title,
      thumbnailImagePath,
      coverImagePath,
      author: req.user.id,
      content
    }).save();

    res.status(201).send();

  });


  app.get('/api/articles/:skip/:limit/author/:editorID', requireLogin, (req, res) => {
    const { skip, limit, editorID } = req.params;

    Article.find({ author: editorID })
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .select('-__v -author -content')
    .then(articles => res.status(200).send({ articles }))
    .catch(err => res.status(500).send({ err }));

  });


  app.get('/api/articles/:skip/:limit', requireLogin, async (req, res) => {

    const { skip, limit } = req.params;
    const articles = await Article.find()
      .populate('author', '_id username')
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .exec();
    
    const allArticlesCount = await Article.countDocuments();

    res.send({ allArticlesCount, articles });

  });


  app.get('/api/public/articles', (req, res) => {
    res.send('success');
  });

  app.delete('/api/articles/:articleID', requireLogin, (req, res) => {

    const { articleID } = req.params;

    Article.findOneAndDelete({ _id: articleID })
    .then(() => {
      res.status(204).send();
    });

  });

  app.get('/api/articles/:articleID', requireLogin, (req, res) => {

    const { articleID } = req.params;

    Article.findOne({ _id: articleID })
    .populate('author', '_id username')
    .select('-_id -createdAt -updatedAt -__v')
    .then((article) => {
      if (!article) return res.status(404).send({ err: 'Článek nebyl v databázi nalezen' });
      res.status(200).send(article);
    })
    .catch(err => res.status(500).send({ err }));

  });

  app.put('/api/articles/:articleID', requireLogin, (req, res) => {

    const { articleID } = req.params;
    const { title, content, thumbnailImagePath, coverImagePath } = req.body;

    Article.findOneAndUpdate({ _id: articleID },
    { title, content, thumbnailImagePath, coverImagePath , updatedAt: new Date() })
    .then(() => res.status(204).send())
    .catch(err => res.status(500).send({ err }));

  });

};