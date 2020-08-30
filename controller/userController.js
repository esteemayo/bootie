// const _ = require('lodash');
const User = require('../models/User');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

/****************************
     const filterObj = (obj, ...allowedFields) => {
         const newObj = {};
        Object.keys(obj).forEach(el => {
            if (allowedFields.includes(el)) newObj[el] = obj[el];
        });
        return newObj;
    };
 */

exports.updateMe = catchAsync(async (req, res, next) => {
    // console.log(req.file);
    // console.log(req.body);

    // Create error if user POSTs password data
    const { password, passwordConfirm } = req.body;

    if (password || passwordConfirm) {
        return next(new AppError(`This route is not for password updates. Please use ${req.protocol}://${req.get('host')}/api/v1/users/updateMyPassword`, 400));
    }

    // Filtered out unwanted fields names that are not allowed to be updated
    // const filterBody = _.pick(req.body, ['firstName', 'lastName', 'email', 'username', 'dateOfBirth', 'bio', 'phone', 'address', 'streetAddress', 'city', 'state', 'zipCode', 'bio']);
    // const filterBody = filterObj(req.body, 'firstName', 'lastName', 'email', 'username', 'dateOfBirth', 'bio', 'phone', 'address', 'streetAddress', 'city', 'state', 'zipCode', 'bio');

    const { firstName, lastName, email, username, phone, dateOfBirth, streetAddress, city, state, zipCode, bio } = req.body;

    let photo;
    if (req.file) photo = req.file.filename;

    // Update user document
    const user = await User.findByIdAndUpdate(req.user.id, {
        firstName,
        lastName,
        email,
        username,
        photo,
        phone,
        dateOfBirth,
        bio,
        address: [
            {
                streetAddress,
                city,
                state,
                zipCode
            }
        ]
    }, {
        new: true,
        runValidators: true
    });

    // Send response
    res.status(200).json({
        status: 'success',
        data: {
            data: user
        }
    });
});

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    // Send response
    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'fail',
        message: `This route is not defined! Please use ${req.protocol}://${req.get('host')}/api/v2/users/register instead`
    });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
// Do NOT update or delete password with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);