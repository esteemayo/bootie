const express = require('express');

// Controllers
const authController = require('../controller/authController');
const commentController = require('../controller/commentController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route('/')
    .get(
        authController.restrictTo('user', 'admin'),
        commentController.getAllComments
    )
    .post(
        authController.restrictTo('user'),
        commentController.sendBlogUserIds,
        commentController.createComment
    );

router
    .route('/:id')
    .get(
        authController.restrictTo('user', 'admin'),
        commentController.getComment
    )
    .patch(
        authController.restrictTo('user', 'admin'),
        commentController.updateComment
    )
    .delete(
        authController.restrictTo('user', 'admin'),
        commentController.deleteComment
    );

module.exports = router;