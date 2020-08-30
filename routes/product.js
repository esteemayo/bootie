const express = require('express');

// Controllers
const authController = require('../controller/authController');
const imageController = require('../controller/imageController');
const productController = require('../controller/productController');

// Review Router
const reviewRouter = require('./review');

const router = express.Router();

// Nested routes
router.use('/:productId/reviews', reviewRouter);

router
    .route('/top-5-products')
    .get(
        productController.topProducts,
        productController.getAllProducts
    );

router
    .route('/product-stats')
    .get(productController.getProductStats);

router.use(authController.protect);

router
    .route('/')
    .get(productController.getAllProducts)
    .post(
        authController.restrictTo('admin'),
        imageController.uploadProductImage,
        imageController.resizeProductImage,
        productController.createProduct
    );

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(
        authController.restrictTo('admin'),
        imageController.uploadProductImage,
        imageController.resizeProductImage,
        productController.updateProduct
    )
    .delete(
        authController.restrictTo('admin'),
        productController.deleteProduct
    );

module.exports = router;