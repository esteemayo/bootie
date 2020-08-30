const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A category must have a name field'],
        maxlength: [15, 'A category name must have less or equal than 15 characters'],
        minlength: [3, 'A category name must have more or equal than 3 characters'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
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

// Document middleware
categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });

    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;