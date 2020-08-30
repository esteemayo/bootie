const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        unique: true,
        trim: true,
        maxlength: [40, 'A product name must have less or equal than 40 characters'],
        minlength: [4, 'A product name must have more or equal than 4 characters']
    },
    description: {
        type: String,
        required: [true, 'A product must have a description!']
    },
    summary: {
        type: String,
        required: [true, 'A product must have a summary!']
    },
    slug: {
        type: String,
        lowercase: true,
        unique: true
    },
    category: {
        type: String,
        required: [true, 'A product must belong to a category!']
    },
    categorySlug: {
        type: String,
        lowercase: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A product must have a price!'],
        match: [/^\d+(?:\.\d{0,2})$/, 'Price must be in two decimal places!']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) must be less than regular price!'
        }
    },
    image: {
        type: String,
        default: 'noimage.png'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Improving read performance with index (Compound index)
productSchema.index({ price: 1, ratingsAverage: 1 });
productSchema.index({ slug: 1, categorySlug: 1 });

// Virtual populate reviews
productSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'product',
    localField: '_id'
});

// Populate user
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email username photo'
    });

    next();
});

// Document middleware
productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    this.categorySlug = slugify(this.category, { lower: true });

    next();
});

// Document middleware
productSchema.pre('save', function (next) {
    const discountPrice = (this.priceDiscount / 100) * this.price;
    this.priceDiscount = this.price - discountPrice;

    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;