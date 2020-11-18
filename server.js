/* eslint-disable */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!🎇 Shutting down gracefully...');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// Database local
const dbLocal = process.env.DATABASE_LOCAL;

// MongoDB Atlas
const db = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

// MongoDB connection
// mongoose.connect(db, {
    mongoose.connect(dbLocal, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => console.log('MongoDB Connected...'))
// .catch(err => console.log(`Could not connect to MongoDB: ${err.message}`));

const PORT = process.env.PORT || 5900;

const server = app.listen(PORT, console.log(`APP LISTENING ON PORT ${PORT}`));

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!🎆 Shutting down gracefully...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

