const mongoose = require('mongoose');
const Product = require('./Product');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review cannot be empty!']
    },
    rating: {
        type: Number,
        min: [1, 'Rating must not be below 1.0'],
        max: [5, 'Rating must not be above 5.0']
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Review must belong to a product!']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Review must belong to a user!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Preventing duplicate review
reviewSchema.index({ product: 1, user: 1 }, { unique: 1 });

// Query middleware
reviewSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email photo'
    });

    next();
});

// reviewSchema.pre('aggregate', function (next) {
//     this.pipeline().unshift({ $match: { review: this.review } });
//     next();
// });

reviewSchema.statics.calcAverageRatings = async function (productId) {
    // console.log(productId);
    const stats = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);
    // console.log(stats);

    // Persist the data(nRating and avgRating) into productSchema or product in general
    if (stats.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].nRating,
            ratingsAverage: stats[0].avgRating
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: 0,
            ratingsAverage: 4.5
        });
    }
};

reviewSchema.post('save', function () {
    this.constructor.calcAverageRatings(this.product);
});

// Updating and deleting review&rating
reviewSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function () {
    await this.r.constructor.calcAverageRatings(this.r.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;