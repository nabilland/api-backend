// routes/order-routes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller.js');
const userMiddleware = require('../middleware/auth-middleware.js');
const userController = require('../controllers/user-controller.js');
const collectorController = require('../controllers/collector-controller.js');
const orderController = require('../controllers/order-controller.js');
const contentController = require('../controllers/content-controller.js');

// Route to get order with 'pick_up' status
router.get('/pickup', userMiddleware.userAuthorization('collector'), orderController.getAllOrderData);

// Route to create order by ID (userId)
router.post('/create/:id', userMiddleware.userAuthorization('user'), orderController.createOrder); //userId
// Route to get all order data by ID (userId)
router.get('/:id', orderController.getOrderDetail); //orderId
// Route to update order status by ID (orderId)
router.put('/update-status/:id', userMiddleware.userAuthorization('collector'), orderController.updateOrderStatus); //orderId
// Route to get order data  with 'delivered' status
router.get('/history/:id', userMiddleware.userAuthorization('user'), orderController.getOrderHistory); //userId

module.exports = router;