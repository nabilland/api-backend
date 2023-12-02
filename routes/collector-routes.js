// routes/collector-routes.js

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth-controller.js');
const userMiddleware = require('../middleware/auth-middleware.js');
const userController = require('../controllers/user-controller.js');
const collectorController = require('../controllers/collector-controller.js');
const orderController = require('../controllers/order-controller.js');
const contentController = require('../controllers/content-controller.js');

// Route to get all data collector
router.get('/all', collectorController.getAllCollectors);

// Route to retrieve/show collector profile by ID (userId)
router.get('/:id', userMiddleware.userAuthorization('collector'), collectorController.getCollectorProfile);
// Route to update collector profile by ID (userId)
router.put('/update-profile/:id', userMiddleware.userAuthorization('collector'), collectorController.updateCollectorProfile);
// Route to update drop location of collector by ID (userId)
router.put('/update-droploc/:id', userMiddleware.userAuthorization('collector'), collectorController.updateDropLocation);
// Route to update current location of collector by ID (userId)
router.put('/update-currloc/:id', userMiddleware.userAuthorization('collector'), collectorController.updateCurrentLocation);

module.exports = router;