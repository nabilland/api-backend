// routes/order-routes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller.js');
const userMiddleware = require('../middleware/auth-middleware.js');
const userController = require('../controllers/user-controller.js');
const collectorController = require('../controllers/collector-controller.js');
const orderController = require('../controllers/order-controller.js');
const contentController = require('../controllers/content-controller.js');

// Route to create order details by ID (userId)
router.post('/create/:id', userMiddleware.userAuthorization('user'), orderController.createOrder); //userId
// Route to show order details by ID (userId)
router.get('/:id', userMiddleware.userAuthorization('user'), orderController.getOrderDetail); //userId
// Route to update order status by ID (orderId)
router.put('/update-status/:id', userMiddleware.userAuthorization('collector'), orderController.updateOrderStatus); //orderId
// Route to show order history
router.get('/history', userMiddleware.userAuthorization('user'), orderController.getOrderHistory);

// Route to get order data
router.get('/all', orderController.getOrderDetail);

module.exports = router;