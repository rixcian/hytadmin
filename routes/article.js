const requireLogin = require('../middlewares/requireLogin');
const mongoose = require('mongoose');
const path = require('path');
const fsPromises = require('fs').promises;

const Article = mongoose.model('Article');

const deleteAllFiles = filesToDelete => 
  new Promise((resolve, reject) => {

    const errors = [];

    if (filesToDelete.length !== 0) {
      filesToDelete.forEach(filePath => {
        let finalFilePath = filePath.split('/api/uploads/').pop();
        fsPromises.unlink(path.join(__dirname, '../uploads', finalFilePath))
          .catch(err => errors.push(err));
      });          
    }

    if (errors.length === 0) {
      resolve()
    } else {
      reject(errors);
    }

  }
);


module.exports = app => {

  app.post('/api/articles', requireLogin, async (req, res) => {

    const { title, articleContent, thumbnailImagePath, coverImagePath, draft } = req.body;

    if (!title || !thumbnailImagePath || !coverImagePath)
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });
    
    await new Article({
      title,
      thumbnailImagePath,
      coverImagePath,
      author: req.user.id,
      content: articleContent || [],
      draft
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
      .select('-__v -content')
      .exec();
    
    const allArticlesCount = await Article.countDocuments();

    res.send({ allArticlesCount, articles });

  });


  app.get('/api/public/articles', (req, res) => {
    res.send('success');
  });


  app.delete('/api/articles/:articleID', requireLogin, (req, res) => {

    const { articleID } = req.params;
    const filesToDelete = [];

    Article.findOne({ _id: articleID })
      .select('thumbnailImagePath coverImagePath content')
      .then(article => {

        // We're checking if thumbnail exists
        if (article.thumbnailImagePath)
          filesToDelete.push(article.thumbnailImagePath);
        
        // We're checking if cover exists
        if (article.coverImagePath)
          filesToDelete.push(article.coverImagePath);

        // We're checking if article has some content
        if (article.content) {
          article.content.forEach(item => {
            if (item.type === 'image' || item.type === 'video')
              item.content && filesToDelete.push(item.content)
          })
        }

        // Calling function to delete all files (images, videos) connected with article
        deleteAllFiles(filesToDelete)
          .then(() => {
            
            // Finally we're deleting article from database
            Article.findOneAndDelete({ _id: articleID })
              .then(() => {
                res.status(204).send();
              })
              .catch(() => {
                res.status(404).send({ err: 'Článek nebyl v databázi nalezen' });
              });

          })
          .catch(errors => res.status(500).send({ err: errors }));
        
      })
      .catch(() => {
        res.status(404).send({ err: 'Článek nebyl v databázi nalezen' });
      })

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
    const { title, articleContent: content, thumbnailImagePath, coverImagePath, draft } = req.body;

    if (!title || !thumbnailImagePath || !coverImagePath)
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });

    Article.findOneAndUpdate({ _id: articleID },
      { title, content, thumbnailImagePath, coverImagePath , updatedAt: new Date(), draft },
      { useFindAndModify: false })
    .then(() => res.status(204).send())
    .catch(err => res.status(500).send({ err }));

  });

};