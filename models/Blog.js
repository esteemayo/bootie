const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'A blog post must have a title'],
        maxlength: [40, 'A blog name must have less or equal than 40 characters'],
        minlength: [10, 'A blog name must have more or equal than 10 charaters'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'A blog post description must be specified'],
        trim: true
    },
    summary: {
        type: String,
        required: [true, 'A blog post summary must be specified'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'A product must belong to a category']
    },
    categorySlug: {
        type: String,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'A blog post must have a price field'],
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    images: [String],
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
blogSchema.index({ price: 1, slug: 1 });

// Virtual property
blogSchema.virtual('halfPrice').get(function (next) {
    return this.price / 2;
});

// Document middleware
blogSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    this.categorySlug = slugify(this.category, { lower: true });

    next();
});

// Virtual populate comments
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

// Populate user into blog collection
blogSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email username photo'
    });

    next();
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;