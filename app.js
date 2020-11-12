const express = require('express');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');

// Routes
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const blogRouter = require('./routes/blog');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const productRouter = require('./routes/product');
const reviewRouter = require('./routes/review');
const viewRouter = require('./routes/view');

const Product = require('./models/Product');
const Review = require('./models/Review');
const Category = require('./models/Category');
const catchAsync = require('./utils/catchAsync');
const helpers = require('./helpers');

// Start express app
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(`${__dirname}/views`));

// Global Middlewares
// Implement CORS
app.use(cors());

// Access-Control-Allow-Origin
app.options('*', cors());

// Serving static files
app.use(express.static(path.join(`${__dirname}/public`)));

// Set security HTTP headers
app.use(helmet());

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit request from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,   // 1 hour
    message: 'Too many request from this IP, Please try again in an hour!'
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser middleware
app.use(cookieParser());

// Method ovverride middleware
app.use(methodOverride('_method'));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: [
        'name',
        'title',
        'price',
        'ratingsAverage',
        'ratingsQuantity'
    ]
}));

// Compression middleware
app.use(compression());

app.use(catchAsync(async (req, res, next) => {
    const reviews = await Review
        .find()
        .limit(1)
        .populate('user');

    res.locals.reviews = reviews;
    next();
}));

app.use(catchAsync(async (req, res, next) => {
    const specialProducts = await Product
        .find({ price: { $lte: 1000 } })
        .limit(5)
        .sort({ price: 1, ratingsQuantity: -1 })
        .select('+name,+price,+priceDiscount,+image');

    const categories = await Category.find();

    const featuredProducts = await Product.aggregate([
        {
            $sample: { size: 3 }
        }
    ]);

    res.locals.specialProducts = specialProducts;
    res.locals.featuredProducts = featuredProducts;
    res.locals.categories = categories;

    next();
}));

app.use((req, res, next) => {
    res.locals.page = req.originalUrl;
    res.locals.h = helpers;
    next();
});

app.use((req, res, next) => {
    res.locals.cart = req.session.cart;
    next();
});

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    // console.log(req.cookies);
    next();
});

// Routes
app.use('/', viewRouter);
app.use('/api/v2/blogs', blogRouter);
app.use('/api/v2/categories', categoryRouter);
app.use('/api/v2/users', userRouter);
app.use('/api/v2/comments', commentRouter);
app.use('/api/v2/products', productRouter);
app.use('/api/v2/reviews', reviewRouter);

app.use('/product', (req, res, next) => {
    res.status(200).redirect('/products');

    next();
});

app.all('*', (req, res, next) => {
    return next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;