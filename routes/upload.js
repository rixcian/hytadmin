const fileUpload = require('express-fileupload');
const requireLogin = require('../middlewares/requireLogin');
const path = require('path');
const fsPromises = require('fs').promises;

const writeFileAndResponse = (destinationFolder, directory, file, articleID, res) => {
  let fileFormat = file.name.split('.'); // e.g. png jpg bmp gif (without dot)
  fileFormat = fileFormat[fileFormat.length-1];

  file.mv(path.join(destinationFolder, `${articleID}.${fileFormat}`), err => {
    if (err) res.status(500).send({ err: "Nastal problém s nahráním souboru" });
    res.send({ fileName: file.name, filePath: `/api/uploads/${directory}/${articleID}.${fileFormat}` });
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

};