const os = require('os');
const router = require('express').Router();
const multer = require('multer');

const productController = require('./controller');

router.post('/products', multer({ dest: os.tmpdir() }).single('image'), productController.store);

module.exports = router;