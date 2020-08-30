const express = require('express');

// Controllers
const authController = require('../controller/authController');
const viewController = require('../controller/viewController');

const router = express.Router();

router.get('/',
    authController.isLoggedIn,
    viewController.getOverview
);

router.get('/products',
    authController.isLoggedIn,
    viewController.getProductsPage
);

router.get('/products/:slug',
    authController.isLoggedIn,
    viewController.getProduct
);

router.post('/products/:id/reviews',
    authController.protect,
    authController.restrictTo('user'),
    viewController.createProductReview
);

router.get('/blogs',
    authController.isLoggedIn,
    viewController.blogOverview
);

router.get('/blogs/:slug',
    authController.isLoggedIn,
    viewController.getBlog
);

router.post('/blogs/:id/comments',
    authController.protect,
    authController.restrictTo('user'),
    viewController.createBlogComment
);

router.get('/auth/login',
    authController.isLoggedIn,
    viewController.getLoginForm
);

router.get('/users/register',
    authController.isLoggedIn,
    viewController.getRegisterForm
);

router.get('/auth/forgot',
    authController.isLoggedIn,
    viewController.getForgotPasswordForm
);

router.get('/auth/reset/:token', viewController.getResetPasswordForm);

router.post('/auth/reset/:token', viewController.resetPassword);

router.get('/about',
    authController.isLoggedIn,
    viewController.about
);

router.get('/account/me',
    authController.isLoggedIn,
    viewController.getAccount
);

router.post('/submit-user-data',
    authController.protect,
    viewController.updateUserData
);

router.get('/contact',
    authController.isLoggedIn,
    viewController.getContact
);

router.post('/contact', viewController.contactMessage);

router.get('/admin/products',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAdminProducts
);

router.get('/admin/products/add',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAddProductForm
);

router.get('/admin/products/:id/edit',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getEditProduct
);

router.delete('/admin/products/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteProduct
);

router.get('/admin/blogs',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAdminBlogs
);

router.get('/admin/blogs/add',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAddBlogForm
);

router.get('/admin/blogs/:id/edit',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getUpdateBlogForm
);

router.delete('/admin/blogs/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteBlog
);

router.get('/admin/categories',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAdminCategory
);

router.get('/admin/categories/add',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAddCategoryForm
);

router.get('/admin/categories/:id/edit',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getEditCategory
);

router.delete('/admin/categories/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteCategory
);

router.get('/admin/reviews',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getAdminReview
);

router.delete('/admin/reviews/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteReview
);

router.get('/admin/comments',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.getComments
);

router.delete('/admin/comments/:id',
    authController.protect,
    authController.restrictTo('admin'),
    viewController.deleteComment
);

router.get('/blog/new',
    authController.protect,
    authController.restrictTo('user'),
    viewController.getAddBlogForm
);

router.get('/products/cart/add/:slug',
    authController.protect,
    authController.restrictTo('user'),
    viewController.addProductToCart
);

router.get('/products/cart/checkout',
    authController.protect,
    authController.restrictTo('user'),
    viewController.getPaymentCheckout
);

router.get('/products/cart/update/:slug',
    authController.protect,
    authController.restrictTo('user'),
    viewController.getUpdateCart
);

router.get('/products/cart/clear',
    authController.protect,
    authController.restrictTo('user'),
    viewController.getClearCart
);

router.get('/products/category/:slug',
    authController.isLoggedIn,
    viewController.getProductCategory
);

router.get('/products/cart/payment',
    authController.isLoggedIn,
    viewController.getPaymentForm
);

router.post('/charge',
    authController.protect,
    viewController.payment
);

router.get('/privacy-policy',
    authController.isLoggedIn,
    viewController.getPrivacyPolicy
);

router.get('/terms-and-conditions',
    authController.isLoggedIn,
    viewController.getTermsAndCondition
);

module.exports = router;