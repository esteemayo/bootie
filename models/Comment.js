const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commentBody: {
        type: String,
        required: [true, 'Please comment field is required.'],
        trim: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: [true, 'A comment must belong to a blog post!']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A comment must belong to a user!']
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

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'user',
        select: 'firstName lastName email photo'
    });

    /**
    *   this.populate({
    *       path: 'blog',
    *       select: 'title'
    *   }).populate({
    *       path: 'user',
    *       select: 'firstName lastName email photo'
    *   });
    */

    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;