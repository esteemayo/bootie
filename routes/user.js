const express = require('express');

// Controllers
const authController = require('../controller/authController');
const userController = require('../controller/userController');
const imageController = require('../controller/imageController');

const router = express.Router();

router.post('/register',
    imageController.uploadUserPhoto,
    imageController.resizeNewUserPhoto,
    authController.register
);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/forgotPassword', authController.forgotPassword);

router.post('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);

router.patch('/updateMe',
    imageController.uploadUserPhoto,
    imageController.resizeUserPhoto,
    userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);

router
    .route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;