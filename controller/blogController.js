/* eslint-disable */

const Blog = require('../models/Blog');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const ReceiveEmail = require('../utils/receiveEmail');

exports.getAllBlogs = factory.getAll(Blog);
exports.getBlog = factory.getOne(Blog, 'comments');

exports.createBlog = catchAsync(async (req, res, next) => {
    if (!req.body.user) req.body.user = req.user.id;

    const blog = await Blog.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: blog
        }
    });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog) {
        return next(new AppError('No blog found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            data: blog
        }
    });
});

exports.deleteBlog = factory.deleteOne(Blog);

exports.contactUs = catchAsync(async (req, res, next) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
        return next(new AppError('Please all fields are required!', 400));
    }

    try {
        await new ReceiveEmail(name, email, phone, subject, message).contactUs();

        return res.status(200).json({
            status: 'success',
            message: 'Thanks for contacting us!'
        });
    } catch (err) {
        return next(new AppError('There was an error sending the email. Try again later.', 500));
    }
});