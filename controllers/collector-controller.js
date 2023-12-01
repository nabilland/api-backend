// controllers/collector-controller.js

const db = require('../lib/db.js');

module.exports = {
    getCollectorProfile: (req, res) => {
        const userId  = req.params.id;

        const selectQuery = `SELECT * FROM users WHERE id = ?`;
        
        db.query(selectQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving user profile:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            const collectorProfile = results[0];          
            const sanitizedProfile = {
                id: collectorProfile.id,
                username: collectorProfile.username,
                email: collectorProfile.email,
                phone: collectorProfile.phone,
                role: collectorProfile.role,
                name: collectorProfile.name,
            };
            res.status(200).json(sanitizedProfile);
        });
    },

    updateCollectorProfile: (req, res) => {
        const userId = req.params.id;
        const { phone, name } = req.body;

        const updateQuery = `UPDATE users SET phone = ?, name = ? WHERE id = ?`;

        db.query(updateQuery, [phone, name, userId], (error) => {
            if(error) {
                console.error('Error updating collector profile:', error);
                return res.status(500).json({
                    error: 'An internal server error has occured',
                });
            }
            res.status(200).json({
                message: 'Profile updated successfully',
            });
        });
    },

    updateDropLocation: (req, res) => {
        const userId = req.params.id;
        const { drop_latitude, drop_longitude } = req.body;

        // Check if data for the user already exists in collectors table
        const selectQuery = `SELECT * FROM collectors WHERE user_id = ?`;
        db.query(selectQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error checking collector data:', error);
                return res.status(500).json({
                    error: 'An internal server error has occurred',
                });
            }
            if (results && results.length > 0) {
                // Data already exists, perform UPDATE
                const updateQuery = `UPDATE collectors SET drop_latitude = ?, drop_longitude = ? WHERE user_id = ?`;
                db.query(updateQuery, [drop_latitude, drop_longitude, userId], (error) => {
                    if (error) {
                        console.error('Error updating collector drop location:', error);
                        return res.status(500).json({
                            error: 'An internal server error has occurred',
                        });
                    }
                    res.status(200).json({
                        message: 'Collector drop location updated successfully',
                    });
                });
            } else {
                // Data doesn't exist, perform INSERT
                const insertQuery = `INSERT INTO collectors (user_id, drop_latitude, drop_longitude) VALUES (?, ?, ?)`;
                db.query(insertQuery, [userId, drop_latitude, drop_longitude], (error) => {
                    if (error) {
                        console.error('Error inserting collector drop location:', error);
                        return res.status(500).json({
                            error: 'An internal server error has occurred',
                        });
                    }
                    res.status(201).json({
                        message: 'Collector drop location added successfully',
                    });
                });
            }
        });
    },

    updateCurrentLocation: (req, res) => {
        const userId = req.params.id;
        const { current_latitude, current_longitude } = req.body;

        // Check if data for the user already exists in collectors table
        const selectQuery = `SELECT * FROM collectors WHERE user_id = ?`;
        
        db.query(selectQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error checking collector data:', error);
                return res.status(500).json({
                    error: 'An internal server error has occurred',
                });
            }
            if (results && results.length > 0) {
                // Data already exists, perform UPDATE
                const updateQuery = `UPDATE collectors SET current_latitude = ?, current_longitude = ? WHERE user_id = ?`;
                db.query(updateQuery, [current_latitude, current_longitude, userId], (error) => {
                    if (error) {
                        console.error('Error updating collector current location:', error);
                        return res.status(500).json({
                            error: 'An internal server error has occurred',
                        });
                    }
                    res.status(200).json({
                        message: 'Collector current location updated successfully',
                    });
                });
            }
        });
    },

    getAllCollectors: (req, res) => {   
        const getAllCollectorsQuery = `SELECT * FROM users LEFT JOIN collectors ON users.id = collectors.user_id`;
        
        db.query(getAllCollectorsQuery, (error, results) => {
            if (error) {
                console.error('Error retrieving all collectors data:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: 'No collectors data not found',
                })
            }
            const allCollectorsData = results.map(collector => ({
                collector_id: collector.id,
                user_id: collector.user_id,
                username: collector.username,
                email: collector.email,
                phone: collector.phone,
                user_role: collector.user_role,
                name: collector.name,
                drop_latitude: collector.drop_latitude,
                drop_longitude: collector.drop_longitude,
            }));
            res.status(200).json(allCollectorsData);
        });
    },
}