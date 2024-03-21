const multer = require('multer');
const path = require('path');
const Image = require('../models/imageModel');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage }).single('image'); 

exports.uploadImage = (req, res) => {
  upload(req, res, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const newImage = new Image({
      filename: req.file.filename,
      filepath: req.file.path,
      size: req.file.size,
      uploader: req.user._id 
    });

    newImage.save()
      .then(image => res.status(201).json(image))
      .catch(error => res.status(500).json({ error: error.message }));
  });
};

