const Product = require('./model');

async function store(req, res, next) {
  try {
    let payload = req.body;

    let product = new Product(payload);

    await product.save();

    return res.json(product);
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