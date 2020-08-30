/*eslint-disable */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// Models
const Product = require('../../models/Product');
const Blog = require('../../models/Blog');
const Category = require('../../models/Category');
const Comment = require('../../models/Comment');
const Review = require('../../models/Review');
const User = require('../../models/User');

dotenv.config({ path: './config.env' });

// Database local
const dbLocal = process.env.DATABASE_LOCAL;

// MongoDB Atlas
const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// MongoDB connection
mongoose.connect(db, {
    // mongoose.connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(`COULD NOT CONNECT TO MONGODB: ${err.message}`));

// Read JSON file
const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json`, 'utf-8'));
const blogs = JSON.parse(fs.readFileSync(`${__dirname}/blogs.json`, 'utf-8'));
const categories = JSON.parse(fs.readFileSync(`${__dirname}/categories.json`, 'utf-8'));
const comments = JSON.parse(fs.readFileSync(`${__dirname}/comments.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// Import data into DB
const importData = async () => {
    try {
        await Product.create(products);
        await Blog.create(blogs);
        await Category.create(categories);
        await Comment.create(comments);
        await Review.create(reviews);
        await User.create(users, { validateBeforeSave: false });

        console.log('Data successfully loaded!');

    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// Delete all data from DB
const deleteData = async () => {
    try {
        await Product.deleteMany();
        await Blog.deleteMany();
        await Category.deleteMany();
        await Comment.deleteMany();
        await Review.deleteMany()
        await User.deleteMany();

        console.log('Data successfully deleted!');

    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

// console.log(process.argv);

// node ./dev-data/data/import-dev-data --import
// node ./dev-data/data/import-dev-data --delete