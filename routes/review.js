const express = require('express');

// Controllers
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(
        authController.restrictTo('admin'),
        reviewController.getAllReviews
    )
    .post(
        authController.restrictTo('user'),
        reviewController.sendProductUserIds,
        reviewController.createReview
    )

router
    .route('/:id')
    .get(
        authController.restrictTo('admin'),
        reviewController.getReview
    )
    .patch(
        authController.restrictTo('admin'),
        reviewController.updateReview
    )
    .delete(
        authController.restrictTo('admin'),
        reviewController.deleteReview
    );

module.exports = router;