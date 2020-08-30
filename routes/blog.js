const express = require('express');

// Controllers
const authController = require('../controller/authController');
const blogController = require('../controller/blogController');
const imageController = require('../controller/imageController');

// Comment Router
const commentRouter = require('./comment');

const router = express.Router();

// Nested routes
router.use('/:blogId/comments', commentRouter);

router.post('/contact', blogController.contactUs);

router.use(authController.protect);

router
    .route('/')
    .get(blogController.getAllBlogs)
    .post(
        imageController.uploadBlogImages,
        imageController.resizeBlogImages,
        blogController.createBlog
    );

router
    .route('/:id')
    .get(blogController.getBlog)
    .patch(
        imageController.uploadBlogImages,
        imageController.resizeBlogImages,
        blogController.updateBlog
    )
    .delete(blogController.deleteBlog);

module.exports = router;