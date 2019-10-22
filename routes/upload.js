const fileUpload = require('express-fileupload');
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

    if (req.files === null) return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { directory, oldThumbnailPath, oldCoverPath, articleID } = req.body;

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

    fsPromises.stat(destinationFolder)
    .then(() => writeFileAndResponse(destinationFolder, directory, file, articleID, res))
    .catch(async () => {
      // creates a new folder and save the file into that folder
      await fsPromises.mkdir(destinationFolder);
      writeFileAndResponse(destinationFolder, directory, file, articleID, res);
    });
  });


  app.post('/api/upload/avatar', requireLogin, (req, res) => {

    if (req.files === null) return res.status(400).send({ err: 'Žádný soubor k nahrání' });

    const { file } = req.files;
    const { oldAvatarPath } = req.body;

    // We're checking if the user replacing avatar image with new one
    if (oldAvatarPath !== '') {
      let oldAvatar = oldAvatarPath.split('/api/uploads/').pop();
      console.log(oldAvatar);
      if (oldAvatar !== 'avatars/default/default_avatar.png') {
        fsPromises.unlink(path.join(__dirname, '../uploads', oldAvatar))
            .catch(err => console.log(err));
      }
    }

    const destinationFolder = path.join(__dirname, '../uploads/avatars');
    let fileFormat = file.name.split('.');
    fileFormat = fileFormat[fileFormat.length-1];

    fsPromises.stat(destinationFolder)
      .then(() => {

        User.findOneAndUpdate({ _id: req.user._id },
          { avatarPath: `/api/uploads/avatars/${req.user._id}.${fileFormat}` },
          { useFindAndModify: false })
          .then(() => writeFileAndResponse(destinationFolder, 'avatars', file, req.user._id, res))
          .catch(err => res.status(500).send({ err }));

      })
      .catch(async () => {
        // creates a new folder and save the file into that folder
        await fsPromises.mkdir(destinationFolder);

        User.findOneAndUpdate({ _id: req.user._id },
          { avatarPath: `/api/uploads/avatars/${req.user._id}.${fileFormat}` },
          { useFindAndModify: false })
          .then(() => writeFileAndResponse(destinationFolder, 'avatars', file, req.user._id, res))
          .catch(err => res.status(500).send({ err }));

      });

  });

};