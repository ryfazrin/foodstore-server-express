const Product = require('./model');

async function store(req, res, next) {
  try {
    let payload = req.body;

    let product = new Product(payload);

    await product.save();

    return res.json(product);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  store
}