const fs = require('fs');
const path = require('path');
const config = require('../config');
const Product = require('./model');

async function store(req, res, next) {
  try {
    let payload = req.body;

    if (req.file) {
      let tmp_path = rrq.file.path;
      let originalExt = req.file.originalname.split('')[req.file.originalname.split('.').length - 1];

      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);
    } else {
      let product = new Product(payload);
      await product.save();

      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      })
    }

    next(err);
  }
}

module.exports = {
  store
}