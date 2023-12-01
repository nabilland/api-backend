// controllers/orders.js

const db = require('../lib/db.js');

module.exports = {
    createOrder: (req, res) => {
        const userId = req.params.id;
        const { waste_type, waste_qty, user_notes, recycle_fee, pickup_fee, pickup_latitude, pickup_longitude } = req.body;
        const order_status = 'pick_up';
        const subtotal_fee = Number(pickup_fee) + Number(recycle_fee);
        const insertQuery = `INSERT INTO orders (user_id, waste_type, waste_qty, user_notes, recycle_fee, pickup_fee, subtotal_fee, order_status, order_datetime, pickup_latitude, pickup_longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, now(), ?, ?)`;
        db.query(insertQuery, [userId, waste_type, waste_qty, user_notes, recycle_fee, pickup_fee, subtotal_fee, order_status, pickup_latitude, pickup_longitude], (error) => {
            if (error) {
                console.error('Error inserting order:', error);
                return res.status(500).json({
                    error: 'An internal server error has occurred',
                });
            }
            res.status(201).json({
                message: 'Order added successfully',
            });
        });
    },

    getOrderDetail: (req, res) => {
        const userId = req.params.id;
        const getUserOrder = `SELECT * FROM orders WHERE user_id = ?`;
            
        db.query(getUserOrder, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving user order data:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: 'No order data not found',
                })
            }
            const userOrderDetail = results.map(order => ({
                order_id: order.id,
                user_id: order.user_id,
                waste_type: order.waste_type,
                waste_qty: order.waste_qty,
                user_notes: order.user_notes,
                recycle_fee: order.recycle_fee,
                pickup_fee: order.pickup_fee,
                subtotal_fee: order.subtotal_fee,
                order_status: order.order_status,
                order_datetime: order.order_datetime,
                pickup_datetime: order.pickup_datetime,
                pickup_latitude: order.pickup_latitude,
                pickup_longitude: order.pickup_longitude,
            }));
            res.status(200).json(userOrderDetail);
        });
    },

    getAllOrderData: (req, res) => {
        const getUserOrder = `SELECT * FROM orders WHERE order_status = 'pick_up'`;
            
        db.query(getUserOrder, (error, results) => {
            if (error) {
                console.error('Error retrieving user order data:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Order data not found',
                })
            }
            const userOrderData = results.map(order => ({
                order_id: order.id,
                user_id: order.user_id,
                waste_type: order.waste_type,
                waste_qty: order.waste_qty,
                user_notes: order.user_notes,
                recycle_fee: order.recycle_fee,
                pickup_fee: order.pickup_fee,
                subtotal_fee: order.subtotal_fee,
                order_status: order.order_status,
                order_datetime: order.order_datetime,
                pickup_datetime: order.pickup_datetime,
                pickup_latitude: order.pickup_latitude,
                pickup_longitude: order.pickup_longitude,
            }));
            res.status(200).json(userOrderData);
        });
    },

    updateOrderStatus: (req, res) => {
        const orderId = req.params.id;
        const { order_status } = req.body;

        const updateQuery = `UPDATE orders SET order_status = ?, pickup_datetime = now() WHERE id = ?`;

        db.query(updateQuery, [order_status, orderId], (error) => {
            if(error) {
                console.error('Error updating order status:', error);
                return res.status(500).json({
                    error: 'An internal server error has occured',
                });
            }
            res.status(200).json({
                message: 'Order status updated successfully',
            });
        });
    },

    getOrderHistory: (req, res) => {
        const userId = req.params.id;
        const getUserOrder = `SELECT * FROM orders WHERE user_id = ? AND order_status = 'delivered'`;
            
        db.query(getUserOrder, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving user order data:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: 'No order data not found',
                })
            }
            const userOrderData = results.map(order => ({
                order_id: order.id,
                user_id: order.user_id,
                waste_type: order.waste_type,
                waste_qty: order.waste_qty,
                user_notes: order.user_notes,
                recycle_fee: order.recycle_fee,
                pickup_fee: order.pickup_fee,
                subtotal_fee: order.subtotal_fee,
                order_status: order.order_status,
                order_datetime: order.order_datetime,
                pickup_datetime: order.pickup_datetime,
                pickup_latitude: order.pickup_latitude,
                pickup_longitude: order.pickup_longitude,
            }));
            res.status(200).json(userOrderData);
        });
    }
}