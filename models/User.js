const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your firstName!']
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your lastName!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email address!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address!']
    },
    username: {
        type: String,
        required: [true, 'Please tell us your username'],
        unique: [true, 'Username already exist. Please choose another.'],
        match: [/^[a-zA-Z0-9]+$/, 'Username is invalid']
    },
    dateOfBirth: String,
    gender: String,
    bio: {
        type: String,
        trim: true,
        maxlength: [200, `A user's bio field must have less or equal than 200 characters!`]
    },
    address: [
        {
            streetAddress: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            zipCode: {
                type: String
            }
        }
    ],
    phone: {
        type: Number,
        required: [true, `Please provide your valid phone number! We won't share your number with anyone!`],
        match: [/^(\()?[2-9]{1}\d{2}(\))?(-|\s)?[2-9]{1}\d{2}(-|\s)\d{4}$/, 'Phone number is invalid!']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [8, 'Password must be atleast 8 characters long'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    photo: {
        type: String,
        default: 'default.jpg'
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
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

// Virtual property(get)
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`;
});

// Virtual property(set)
userSchema.virtual('fullName').set(function (name) {
    const str = name.split(' ');

    this.firstName = str[0];
    this.lastName = str[1];
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;

    next();
});

// Update passwordChangedAt property for the user
userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;

    next();
});

// Query middleware
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        // console.log(JWTTimestamp, changedTimestamp);

        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;    // 10 minutes

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;