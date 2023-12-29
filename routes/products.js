const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.route('/')
    .get(productController.getAllProducts)
 

router.route('/testing')
    .get(productController.getAllProductsTesting);
  

module.exports = router;
