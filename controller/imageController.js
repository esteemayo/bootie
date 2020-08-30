const sharp = require('sharp');
const multer = require('multer');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/**************************
     const multerStorage = multer.diskStorage({
         destination: (req, file, cb) => {
             cb(null, 'public/img/users');
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            return cb(null, `users-${req.user.id}-${Date.now()}.${ext}`);
        }
    });
 */

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        return cb(null, true);
    }
    cb(new AppError('Not an image! Please upload only images', 400), false);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.uploadProductImage = upload.single('image');

// exports.uploadBlogImages = upload.array('images', 2);
exports.uploadBlogImages = upload.fields([
    { name: 'images', maxCount: 2 }
]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `users-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

exports.resizeNewUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `users-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

exports.resizeProductImage = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    const id = !req.params.id ? 'new' : req.params.id;

    req.file.filename = `products-${id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${req.file.filename}`);

    next();
});

exports.resizeBlogImages = catchAsync(async (req, res, next) => {
    // console.log(req.files);
    if (!req.files.images) return next();

    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {
            const id = !req.params.id ? 'new' : req.params.id;

            const filename = `blogs-${id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/blogs/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});