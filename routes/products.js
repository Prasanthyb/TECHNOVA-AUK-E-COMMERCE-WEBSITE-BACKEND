const express = require('express');
const router = express.Router();
const productController = require('../controllers/products');

router.route('/')
    .get(productController.getAllProducts)
    .post(productController.createNewProducts);


router.route('/:id')
    .put(productController.deleteProductsById)
    
  

module.exports = router;
