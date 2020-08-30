const Product = require('../models/Product');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

exports.topProducts = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,description,summary,ratingsAverage,ratingsQuantity,price,priceDiscount';

    next();
};

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product, 'reviews');
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.deleteProduct = factory.deleteOne(Product);

exports.getProductStats = catchAsync(async (req, res, next) => {
    const stats = await Product.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: '$ratingsAverage',
                // _id: '$ratingsQuantity',
                numProducts: { $sum: 1 },
                numRating: { $sum: '$ratingsQuantity' },
                avgRating: { $sum: '$ratingsAverage' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' }
            }
        },
        {
            $sort: { avgPrice: -1 }
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: stats.length,
        data: {
            stats
        }
    });
});