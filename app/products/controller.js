const fs = require('fs');
const path = require('path');
const config = require('../config');
const Product = require('./model');
const Category = require('../categories/model');
const Tag = require('../tags/model');

// List Products
async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query; // BASE_URL/api/products?limit=10&skip=0

    let products = await Product.find().limit(parseInt(limit)).skip(parseInt(skip));

    return res.json(products);
  } catch (err) {
    next(err);
  }
}

async function store(req, res, next) {
  try {
    let payload = req.body;

    // handle add category in product
    if (payload.category) {
      let category =
        await Category
          .findOne({ name: { $regex: payload.category, $options: 'i' } });

      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } })

      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      }
    }

    // handle if file exist on request
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];

      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();

          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path); // jika error, hapus file yang sudah terupload pada direktori

          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            })
          }

          next(err);
        }
      });

      src.on('error', async () => {
        next(err);
      });
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

async function update(req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      let category =
        await Category.findOne({ name: { $regex: payload.category, $options: 'i' } })

      if (category) {
        payload = { ...payload, category: category._id }
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length) {
      let tags = await Tag.find({ name: { $in: payload.tags } })
      if (tags.length) {
        payload = { ...payload, tags: tags.map(tag => tag._id) }
      }
    }

    // handle if file exist on request
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];

      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/upload/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on('end', async () => {
        try {
          let product = await Product.findOne({ _id: req.params.id });

          let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findOneAndUpdate({ _id: req.params.id }, {
            ...payload,
            image_url: filename
          }, { new: true, runValidators: true });

          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path); // jika error, hapus file yang sudah terupload pada direktori

          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            })
          }

          next(err);
        }
      });

      src.on('error', async () => {
        next(err);
      });
    } else {
      let product = await Product
        .findOneAndUpdate({ _id: req.params.id }, payload, {
          new: true,
          runValidators: true
        });

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

async function destroy(req, res, next) {
  try {
    let product = await Product.findOneAndDelete({ _id: req.params.id });

    let currentImage = `${config.rootPath}/public/upload/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }

    return res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  index,
  store,
  update,
  destroy
}