const express = require('express');

// Controllers
const authController = require('../controller/authController');
const categoryController = require('../controller/categoryController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router
    .route('/')
    .get(categoryController.getAllCategories)
    .post(categoryController.createCategory);

router
    .route('/:id')
    .get(categoryController.getCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

module.exports = router;