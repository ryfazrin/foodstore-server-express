const router = require('express').Router();
const multer = require('multer');

const categoryController = require('./controller');

router.post('/categories', multer().none(), categoryController.store);

module.exports = router;