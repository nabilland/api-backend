// controllers/users.js

const db = require('../lib/db.js');

module.exports = {
    getUserProfile: (req, res) => {
        const { userId } = req.userData;
    
        const selectQuery = `SELECT * FROM users WHERE id = ?`;
        db.query(selectQuery, [userId], (error, results) => {
            if (error) {
                console.error('Error retrieving user profile:', error);
                return res.status(500).json({
                    error: 'An internal server error occured',
                });
            }
            const userProfile = results[0];
            
            const sanitizedProfile = {
                id: userProfile.id,
                username: userProfile.username,
                email: userProfile.email,
                phone: userProfile.phone,
                role: userProfile.role,
                fname: userProfile.fname,
                lname: userProfile.lname,
            };
            res.status(200).json(sanitizedProfile);
        });
    },

    updateUserProfile: (req, res) => {
        const { userId } = req.userData;
        const { phone, fname, lname } = req.body;

        const updateQuery = `UPDATE users SET phone = ?, fname = ?, lname = ? WHERE id = ?`;

        db.query(updateQuery, [phone, fname, lname, userId], (error) => {
            if(error) {
                console.error('Error updating user profile:', error);
                return res.status(500).json({
                    error: 'An internal server error has occured',
                });
            }
            res.status(200).json({
                message: 'Profile updated successfully',
            });
        });
    }
}