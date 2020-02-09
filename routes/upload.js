const fileUpload = require('express-fileupload');
const generator = require('generate-password');
const requireLogin = require('../middlewares/requireLogin');
const path = require('path');
const fsPromises = require('fs').promises;
const mongoose = require('mongoose');

const User = mongoose.model('User');

const writeFileAndResponse = (destinationFolder, directory, file, fileName, res) => {
  let fileFormat = file.name.split('.'); // e.g. png jpg bmp gif (without dot)
  fileFormat = fileFormat[fileFormat.length-1];

  file.mv(path.join(destinationFolder, `${fileName}.${fileFormat}`), err => {
    if (err) res.status(500).send({ err: "Nastal problém s nahráním souboru" });
    res.send({ fileName: `${fileName}.${fileFormat}`, filePath: `/api/uploads/${directory}/${fileName}.${fileFormat}` });
  });
};

module.exports = app => {

  app.use(fileUpload());

  app.post('/api/upload', requireLogin, (req, res) => {

    // We're checking if client is sending some file to save
    if (req.files === undefined) return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { directory, oldThumbnailPath, oldCoverPath } = req.body;
    
    // We're checking if client enter all needed values
    if (!directory || typeof oldThumbnailPath === 'undefined' || typeof oldCoverPath === 'undefined') 
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });

    // We're checking if the user replacing thumbnail image with new one
    if (oldThumbnailPath !== '') {
      let oldThumbnail = oldThumbnailPath.split('/api/uploads/').pop();
      fsPromises.unlink(path.join(__dirname, '../uploads', oldThumbnail))
        .catch(err => console.log(err));
    }

    // We're checking if the user replacing cover image with new one
    if (oldCoverPath !== '') {
      let oldCover = oldCoverPath.split('/api/uploads/').pop();
      fsPromises.unlink(path.join(__dirname, '../uploads', oldCover))
        .catch(err => console.log(err));
    }

    const destinationFolder = path.join(__dirname, '../uploads', directory);
    const generatedFileName = generator.generate({
      length: 12,
      numbers: true
    });

    // We're checking if the folder exists
    fsPromises.stat(destinationFolder)
    .then(() => writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res))
    .catch(async () => {
      // creates a new folder and save the file into that folder
      await fsPromises.mkdir(destinationFolder);
      writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res);
    });
  });


  app.post('/api/upload/avatar', requireLogin, (req, res) => {

    // We're checking if client is sending some file to save
    if (!req.files) return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { oldAvatarPath } = req.body;

    // We're checking if client enter all needed values
    if (typeof oldAvatarPath === 'undefined') 
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });

    // We're checking if the user replacing avatar image with new one
    if (oldAvatarPath !== '') {
      let oldAvatar = oldAvatarPath.split('/api/uploads/').pop();

      if (oldAvatar !== 'avatars/default/default_avatar.png') {
        fsPromises.unlink(path.join(__dirname, '../uploads', oldAvatar))
            .catch(err => console.log(err));
      }
    }

    const destinationFolder = path.join(__dirname, '../uploads/avatars');
    let fileFormat = file.name.split('.');
    fileFormat = fileFormat[fileFormat.length-1];

    // We're checking if the folder exists
    fsPromises.stat(destinationFolder)
      .then(() => {

        User.findOneAndUpdate({ _id: req.user._id },
          { avatarPath: `/api/uploads/avatars/${req.user._id}.${fileFormat}` },
          { useFindAndModify: false })
          .then(() => writeFileAndResponse(destinationFolder, 'avatars', file, req.user._id, res))
          .catch(err => res.status(500).send({ err: err }));

      })
      .catch(async () => {
        // creates a new folder and save the file into that folder
        await fsPromises.mkdir(destinationFolder);

        User.findOneAndUpdate({ _id: req.user._id },
          { avatarPath: `/api/uploads/avatars/${req.user._id}.${fileFormat}` },
          { useFindAndModify: false })
          .then(() => writeFileAndResponse(destinationFolder, 'avatars', file, req.user._id, res))
          .catch(err => res.status(500).send({ err: err }));

      });

  });


  app.post('/api/upload/image', requireLogin, (req, res) => {

    // We're checking if client is sending some file to save
    if (!req.files) 
      return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { directory, oldImagePath } = req.body;

    // We're checking if client enter all needed values
    if (!directory) 
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });
    
    // We're checking if the user replacing image with new one
    if (oldImagePath !== '') {
      let oldImage = oldImagePath.split('/api/uploads/').pop();
      fsPromises.unlink(path.join(__dirname, '../uploads', oldImage))
        .catch(err => res.status(500).send({ err: err }));
    }

    const destinationFolder = path.join(__dirname, '../uploads', directory);
    const generatedFileName = generator.generate({
      length: 12,
      numbers: true
    });

    // We're checking if the folder exists
    fsPromises.stat(destinationFolder)
      .then(() => writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res))
      .catch(async () => {
        // creates a new folder and save the file into that folder
        await fsPromises.mkdir(destinationFolder);
        writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res);
      });

  });


  app.post('/api/upload/image/delete', requireLogin, (req, res) => {
    
    const { imagePathToDelete } = req.body;

    if (!imagePathToDelete)
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });

    let targetFile = imagePathToDelete.split('/api/uploads/').pop();
    targetFile = path.join(__dirname, '../uploads', targetFile);

    // We're checking if the file exists 
    fsPromises.stat(targetFile)
      .then(() => {
        fsPromises.unlink(targetFile)
          .then(() => res.status(202).send())
          .catch(err => res.status(500).send({ err: err }))
      })
      .catch(() => res.status(400).send({ err: 'Soubor neexistuje' }));

  });


  app.post('/api/upload/video', requireLogin, (req, res) => {
    
    // We're checking if client is sending some file to save
    if (!req.files) 
      return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { directory, oldVideoPath } = req.body;

    // We're checking if the user replacing image with new one
    if (oldVideoPath !== '') {
      let oldVideo = oldVideoPath.split('/api/uploads/').pop();
      fsPromises.unlink(path.join(__dirname, '../uploads', oldVideo))
        .catch(err => res.status(500).send({ err: err }));
    }

    const destinationFolder = path.join(__dirname, '../uploads', directory);
    const generatedFileName = generator.generate({
      length: 12,
      numbers: true
    });

    // We're checking if the folder exists
    fsPromises.stat(destinationFolder)
      .then(() => writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res))
      .catch(async () => {
        // creates a new folder and save the file into that folder
        await fsPromises.mkdir(destinationFolder);
        writeFileAndResponse(destinationFolder, directory, file, generatedFileName, res);
      });
  
  });


  app.post('/api/upload/video/delete', requireLogin, (req, res) => {

    const { videoPathToDelete } = req.body;

    if (!videoPathToDelete)
      return res.status(400).send({ err: 'Nezadali jste všechny parametry' });

    let targetFile = videoPathToDelete.split('/api/uploads/').pop();
    targetFile = path.join(__dirname, '../uploads', targetFile);

    // We're checking if the file exists 
    fsPromises.stat(targetFile)
      .then(() => {
        fsPromises.unlink(targetFile)
          .then(() => res.status(202).send())
          .catch(err => res.status(500).send({ err: err }))
      })
      .catch(() => res.status(400).send({ err: 'Soubor neexistuje' }));

  })

};