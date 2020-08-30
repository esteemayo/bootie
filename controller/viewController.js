/* eslint-disable */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const crypto = require('crypto');
const Blog = require('../models/Blog');
const User = require('../models/User');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const Product = require('../models/Product');
const AppError = require('../utils/appError');
const Category = require('../models/Category');
const catchAsync = require('../utils/catchAsync');
const ReceiveEmail = require('../utils/receiveEmail');

exports.getOverview = catchAsync(async (req, res, next) => {
    // Get product data from collection
    const products = await Product
        .find()
        .sort({ createdAt: 'desc' })
        .limit(9);

    // Build and render template using the product data
    res.status(200).render('overview', {
        title: 'Home',
        products
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    // Get blog from collection
    const product = await Product.findOne({ slug: req.params.slug }).populate('reviews');

    // Check if document is found or correct
    if (!product) {
        return next(new AppError('No product found with that NAME', 404));
    }

    // Build and render template using the product data
    res.status(200).render('product', {
        title: product.name,
        product
    });
});

exports.blogOverview = catchAsync(async (req, res, next) => {
    // Get blog data from collection
    const blogs = await Blog
        .find()
        .sort({ createdAt: -1 });

    // Build and render template using the blog data
    res.status(200).render('blogOverview', {
        title: 'Blog Overview',
        blogs
    });
});

exports.getBlog = catchAsync(async (req, res, next) => {
    // Get blog from collection using slug as filter object & populate comments into the collection
    const blog = await Blog.findOne({ slug: req.params.slug }).populate({
        path: 'comments',
        fields: 'commentBody user'
    });

    // Check if document exists or the slug is correct
    if (!blog) {
        return next(new AppError('No blog found with that TITLE', 404));
    }

    // Build and render template using the blog data
    res.status(200).render('blog', {
        title: blog.title,
        blog
    });
});

exports.getProductsPage = catchAsync(async (req, res, next) => {
    if (req.query.search) {
        // Get product data from collection
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        const products = await Product.find({ 'name': regex }).sort({ createdAt: -1 });

        // Check if query matches any data in the collection, if not throw error
        if (products.length < 1) {
            return next(new AppError('No product match that query! Please try again.', 404));
        }

        // Build and render template using the product data
        res.status(200).render('products', {
            title: 'Products',
            products
        });
    } else {
        // Get product data from collection
        const products = await Product.find().sort({ createdAt: -1 });

        // Build and render template using the product data
        res.status(200).render('products', {
            title: 'Products',
            products
        });
    }
});

exports.createProductReview = catchAsync(async (req, res, next) => {
    // Get product from collection with the id
    const product = await Product.findById(req.params.id);

    // Check if document exists or correct
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    // Post review and rating
    await Review.create({
        review: req.body.review,
        rating: req.body.rating,
        product: product._id,
        user: req.user._id
    });

    // Redirect back after successfully request
    res.status(201).redirect(`/products/${product.slug}`);
});

exports.createBlogComment = catchAsync(async (req, res, next) => {
    // Get blog from collection using id
    const blog = await Blog.findById(req.params.id);

    // Check if document exists or incorrect
    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    // Create comment and save
    await Comment.create({
        commentBody: req.body.commentBody,
        blog: blog._id,
        user: req.user._id
    });

    // Redirect back(same page)
    return res.status(201).redirect(`/blogs/${blog.slug}`);
});

exports.getAdminProducts = catchAsync(async (req, res, next) => {
    // Get product data from collection
    const products = await Product.find();

    // Build and render template using the product data
    res.status(200).render('adminProducts', {
        title: 'Admin - Products',
        products
    });
});

exports.getAddProductForm = catchAsync(async (req, res, next) => {
    // Get category data from collection
    const categories = await Category.find();

    // Build and render template using the category data
    res.status(200).render('addProduct', {
        title: 'Admin - Add Product',
        categories
    });
});

exports.getEditProduct = catchAsync(async (req, res, next) => {
    // Get product from collection using id
    const product = await Product.findById(req.params.id);
    // Get category from collection
    const categories = await Category.find();

    // Check if product exists or the id is correct
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    // Build and render template using the product & category data
    res.status(200).render('editProduct', {
        title: 'Admin - Edit Product',
        product,
        categories
    });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    // Get product from collection using id and remove from collection
    const product = await Product.findByIdAndDelete(req.params.id);

    // Check if product exist or id is correct
    if (!product) {
        return next(new AppError('No product found with that ID', 404));
    }

    // Redirect back(same page)
    res.status(204).redirect('back');
});

exports.getAdminBlogs = catchAsync(async (req, res, next) => {
    // Get blog data from collection
    const blogs = await Blog.find();

    // Build and render template using the blog data
    res.status(200).render('adminBlogs', {
        title: 'Admin - Blogs',
        blogs
    });
});

exports.getAddBlogForm = catchAsync(async (req, res, next) => {
    // Get category data from collection
    const categories = await Category.find();

    // Build and render template using the category data
    res.status(200).render('addBlog', {
        title: 'Create New Blog',
        categories
    });
});

exports.getUpdateBlogForm = catchAsync(async (req, res, next) => {
    // Get blog from collection using id
    const blog = await Blog.findById(req.params.id);
    // Get category from collection
    const categories = await Category.find();

    // Check if id is correct or wrong
    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    // Build and render template using the blog & category data
    res.status(200).render('editBlog', {
        title: 'Admin - Update Blog',
        blog,
        categories
    });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    // Get blog from collection using id
    const blog = await Blog.findByIdAndDelete(req.params.id);

    // Check if the id is correct
    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    // Redirect back
    res.status(204).redirect('back');
});

exports.getAdminCategory = catchAsync(async (req, res, next) => {
    // Get category data from collection
    const categories = await Category.find();

    // Build and render template using the category data
    res.status(200).render('categories', {
        title: 'Admin - Category',
        categories
    });
});

exports.getEditCategory = catchAsync(async (req, res, next) => {
    // Get category from collection using id
    const category = await Category.findById(req.params.id);

    // If not found return 404 error
    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    // Build and render template using the category data
    res.status(201).render('editCategory', {
        title: 'Admin - Edit Category',
        category
    });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
    // Get category from collection and delete
    const category = await Category.findByIdAndDelete(req.params.id);

    // If not found then send error
    if (!category) {
        return next(new AppError('No category found with that ID', 404));
    }

    // Redirect
    res.status(204).redirect('/admin/categories');
});

exports.getAdminReview = catchAsync(async (req, res, next) => {
    // Get review data from collection
    const reviews = await Review.find();

    // Build and render template using the review data
    res.status(200).render('reviews', {
        title: 'Admin - Reviews',
        reviews
    });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    // Get review from collection & remove
    const review = await Review.findByIdAndDelete(req.params.id);

    // If review not found then throw err
    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    // Redirect back
    res.status(204).redirect('back');
});

exports.getComments = catchAsync(async (req, res, next) => {
    // Get comment data from collection
    const comments = await Comment.find();

    // Build and render template using the comment data
    res.status(200).render('comments', {
        title: 'Admin - Comments',
        comments
    });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
    // Get comment from collection and remove
    const comment = await Comment.findByIdAndDelete(req.params.id);

    // If not found send error
    if (!comment) {
        return next(new AppError('No comment found with that ID', 404));
    }

    // Redirect back
    res.status(204).redirect('back');
});

exports.addProductToCart = catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const product = await Product.findOne({ slug });

    if (typeof req.session.cart === 'undefined') {
        req.session.cart = [];

        req.session.cart.push({
            name: product.name,
            slug: product.slug,
            qty: 1,
            price: parseFloat(product.price).toFixed(2),
            priceDiscount: parseFloat(product.priceDiscount).toFixed(2),
            image: `/img/products/${product.image}`,
            id: product._id
        });
    } else {
        const cart = req.session.cart;
        let newItem = true;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i].name === slug) {
                cart[i].qty++;
                newItem = false;
                break;
            }
        }

        // Check if new item is true
        if (newItem) {
            cart.push({
                name: product.name,
                slug: product.slug,
                qty: 1,
                price: parseFloat(product.price).toFixed(2),
                priceDiscount: parseFloat(product.priceDiscount).toFixed(2),
                image: `/img/products/${product.image}`,
                id: product._id
            });
        }
    }
    // console.log(req.session.cart);
    return res.status(200).redirect('back');
});

exports.getPaymentCheckout = (req, res) => {
    if (req.session.cart && req.session.cart.length === 0) {
        delete req.cart.session;
        return res.status(200).redirect('/products/cart/checkout');
    }

    return res.status(200).render('checkout', {
        title: 'Payment Checkout',
        cart: req.session.cart
    });
};

exports.getUpdateCart = catchAsync(async (req, res, next) => {
    const slug = req.params.slug;
    const cart = req.session.cart;
    const action = req.query.action;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].slug === slug) {
            switch (action) {
                case 'add':
                    cart[i].qty++;
                    break;
                case 'remove':
                    cart[i].qty--;
                    if (cart[i].qty < 1) cart.splice(i, 1);
                    break;
                case 'clear':
                    cart.splice(i, 1);
                    if (cart.length === 0) delete cart;
                    break;

                default:
                    // console.log('There is problem updating your cart');
                    next(new AppError('There is problem updating your cart', 400));
                    break;
            }
            break;
        }
    }

    // return res.status(200).redirect('/products/cart/checkout');
    return res.status(200).redirect('back');
});

exports.getClearCart = (req, res) => {
    delete req.session.cart;
    // return res.status(204).redirect('/products/cart/checkout');
    return res.status(204).redirect('back');
};

exports.getPaymentForm = (req, res) => {
    if (!req.session.cart) {
        return res.status(400).redirect('back');
    }
    res.status(200).render('payment', {
        cart: req.session.cart
    });
};

exports.payment = catchAsync(async (req, res, next) => {
    if (!req.session.cart) {
        return res.status(400).redirect('back');
    }

    const cart = req.session.cart;

    let total = 0;
    cart.forEach(c => {
        const sub = parseFloat(c.priceDiscount * c.qty).toFixed(2);
        total += +sub;
    });

    // Token is created using Stripe Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = request.body.stripeToken; // Using Express

    const charge = await stripe.charges.create({
        amount: total * 100,
        currency: 'usd',
        description: 'Example charge',
        source: token,
    });

    req.session.cart = null;

    res.status(200).redirect('/');
});

exports.getProductCategory = catchAsync(async (req, res, next) => {
    // Get product data from collection
    const products = await Product.find({ categorySlug: req.params.slug });

    // Build and render template using the category data
    res.status(200).render('products', {
        title: 'Products',
        products
    });
});

exports.getResetPasswordForm = catchAsync(async (req, res, next) => {
    // Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }

    // Build and render template using the token
    res.status(200).render('reset', {
        title: 'Reset Password',
        token: hashedToken
    });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ passwordResetToken: req.params.token, passwordResetExpires: { $gt: Date.now() } });

    // If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError('Token is invalid or has expired.', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update passwordChangedAt property for the user
    // Redirect the user to log in route & send JWT
    return res.status(200).redirect('/auth/login');
});

exports.updateUserData = catchAsync(async (req, res, next) => {
    // Get user from collection and update data
    const updatedUser = await User.findByIdAndUpdate(req.user.id, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        phone: req.body.phone,
        dateOfBirth: req.body.dateOfBirth,
        bio: req.body.bio,
        address: [
            {
                streetAddress: req.body.streetAddress,
                city: req.body.city,
                state: req.body.state,
                zipCode: req.body.zipCode
            }
        ]
    }, {
        new: true,
        runValidators: true
    });

    res.status(200).render('account', {
        title: 'Account Settings',
        user: updatedUser
    });
});

exports.contactMessage = catchAsync(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        return next(new AppError('Please all fields are required!', 400));
    }

    try {
        await new ReceiveEmail(name, email, phone, subject, message).contactUs();

        return res.status(200).redirect('/contact');
    } catch (err) {
        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});

exports.about = catchAsync(async (req, res, next) => {
    res.status(200).render('about', {
        title: 'About'
    });
});

exports.getLoginForm = (req, res) => {
    if (res.locals.user) return res.status(400).redirect('/');

    res.status(200).render('login', {
        title: 'Log into your account!'
    });
};

exports.getRegisterForm = (req, res) => {
    if (res.locals.user) return res.status(400).redirect('/');

    res.status(200).render('register', {
        title: 'Create your account!'
    });
};

exports.getForgotPasswordForm = (req, res) => {
    if (res.locals.user) return res.status(400).redirect('/');

    res.status(200).render('forgot', {
        title: 'Forgot Password',
    });
};

exports.getAccount = (req, res) => {
    if (!res.locals.user) return res.status(400).redirect('/auth/login');

    res.status(200).render('account', {
        title: 'Account Settings'
    });
};

exports.getAddCategoryForm = (req, res) => {
    res.status(200).render('addCategory', {
        title: 'Admin - Add Category'
    });
};

exports.getContact = (req, res) => {
    res.status(200).render('contact', {
        title: 'Contact Us!'
    });
};

exports.getPrivacyPolicy = (req, res) => {
    res.status(200).render('privacyPolicy', {
        title: 'Privacy Policy'
    });
};

exports.getTermsAndCondition = (req, res) => {
    res.status(200).render('terms', {
        title: 'Terms and Conditions'
    });
};



// Search query func(regexp)
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};