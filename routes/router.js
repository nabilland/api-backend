// routes/router.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController.js');
const userMiddleware = require('../middleware/authMiddleware.js');
const userController = require('../controllers/usersController.js');
const collectorController = require('../controllers/collectorsController.js');
const orderController = require('../controllers/ordersController.js');
const contentController = require('../controllers/contentsController.js');

// AUTHENTICATION
// Route to register
router.post('/register', userMiddleware.validateRegister, authController.registerUser);
// Route to log in
router.post('/login', authController.loginUser);
// Route to log out
router.post('/logout', authController.logoutUser);

// USERS
// Route to retrieve/show profile
router.get('/index-user', userMiddleware.userAuthorization('user'), userController.getUserProfile);
router.get('/index-collector', userMiddleware.userAuthorization('collector'), collectorController.getCollectorProfile);
// Route to update profile
router.put('/update-user-profile', userMiddleware.userAuthorization('user'), userController.updateUserProfile);
router.put('/update-collector-profile', userMiddleware.userAuthorization('collector'), collectorController.updateCollectorProfile);

// COLLECTORS
// Route to update drop location of collector
router.put('/update-droploc', userMiddleware.userAuthorization('collector'), collectorController.updateDropLocation);
// Route to update current location of collector
router.put('/update-currloc', userMiddleware.userAuthorization('collector'), collectorController.updateCurrentLocation);
// Route to get all data collector
router.get('/collectors', collectorController.getAllCollectors);

//ORDERS
// Route to create an order
router.post('/create-order', userMiddleware.userAuthorization('user'), orderController.createOrder);
// Route to show order details
router.get('/orders', userMiddleware.userAuthorization('user'), orderController.getUserOrder);
// Route to update order status
router.put('/update-order-status', userMiddleware.userAuthorization('collector'), orderController.updateOrderStatus);
// Route to show order history
router.get('/order-history', userMiddleware.userAuthorization('user'), orderController.showOrderHistory);

// CONTENTS
// Route to create a content
router.post('/create-content', contentController.createContent);
// Route to show content
router.get('/index-content', contentController.showContent);
// Route to show content based on ID
router.get('/content', contentController.showContentById);
// Route to edit content based on ID
router.put('/update-content', contentController.updateContentById);
// Route to delete content based on ID
router.delete('/delete-content', contentController.deleteContentById);

module.exports = router;