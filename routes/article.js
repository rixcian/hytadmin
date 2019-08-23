const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');

const Article = mongoose.model('articles');

module.exports = app => {


  app.post('/api/article', requireLogin, async (req, res) => {
    const { title, content } = req.body;
    
    await new Article({
      title,
      author: req.user.id,
      content
    }).save();

    res.status(201).send({ success: true, err: null });

  });


  app.get('/api/article/:skip/:limit', requireLogin, async (req, res) => {
    const { skip, limit } = req.params;
    const articles = 
      await Article.find()
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .exec();
    
    const allArticlesCount = await Article.countDocuments();

    res.send({ success: true, err: null, allArticlesCount, articles });

  });


  app.get('/api/public/article', (req, res) => {
    res.send('success');
  });


}