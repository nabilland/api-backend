// routes/router.js

const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const jwt = require('jsonwebtoken');

const db = require('../lib/db.js');
const userMiddleware = require('../middleware/auth.js');
const userController = require('../controllers/users.js');
const collectorController = require('../controllers/collectors.js');
const orderController = require('../controllers/orders.js');

// Route to register
router.post('/register', userMiddleware.validateRegister, (req, res, next) => {
    db.query(
        'SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
        [req.body.username, req.body.email],
        (err, result) => {
            if (result && result.length) {
                // error
                return res.status(409).send({
                    message: 'Username or email already in use!',
                });
                } else {
                // username or email not in use
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).send({
                        message: err,
                    });
                    } else {
                        db.query(
                            'INSERT INTO users (id, username, email, password, phone, role, fname, lname, registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now());',
                            [uuid.v4(), req.body.username, req.body.email, hash, req.body.phone, req.body.role, req.body.fname, req.body.lname],
                            (err, result) => {
                                if (err) {
                                    return res.status(400).send({
                                        message: err,
                                    });
                                }
                                return res.status(201).send({
                                    message: 'Registered!',
                                });
                            }
                        );
                    }
                });
            }
        }
    );
});

// Route to log in
router.post('/login', (req, res, next) => {
    db.query(
        `SELECT * FROM users WHERE username = ? OR email = ?`,
        [req.body.username, req.body.email],
        (err, result) => {
            if (err) {
                return res.status(400).send({
                    message: err,
                });
            }
            if (!result.length) {
                return res.status(400).send({
                    message: 'Username or email not found!',
                });
            }
            bcrypt.compare(
                req.body.password,
                result[0]['password'],
                (bErr, bResult) => {
                    if (bErr) {
                        return res.status(400).send({
                            message: 'Invalid credentials!',
                        });
                    }
                    if (bResult) {
                        // password match
                        const token = jwt.sign(
                            {
                                username: result[0].username,
                                userId: result[0].id, 
                                role: result[0].role, 
                            },
                            'SECRETKEY',
                            { expiresIn: '7d' }
                        );
                        db.query(
                            `UPDATE users SET last_login = now() WHERE id = ?;`,
                            [result[0].id],
                            (updateErr, updateResult) => {
                                if (updateErr) {
                                    return res.status(400).send({
                                        message: updateErr,
                                    });
                                }
                                return res.status(200).send({
                                    message: 'Logged in successfully!',
                                    token,
                                    user: result[0],
                                });
                            }
                        );
                    } else {
                        console.log('Password mismatch:', req.body.password, result[0]['password']);
                        return res.status(400).send({
                            message: 'Invalid password!',
                        });
                    }
                }
            );
        }
    );
});

// Route to log out
router.post('/logout', userMiddleware.isLoggedIn, (req, res, next) => {
    userMiddleware.clearSession(req, res, () => {
        res.status(200).send({ 
            message: 'Logged out successfully!'
        });
    });
});


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
router.get('/history-order', userMiddleware.userAuthorization('user'), orderController.showOrderHistory);

// CONTENTS
// Route
module.exports = router;