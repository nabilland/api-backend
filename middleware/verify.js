// middleware/verify.js

const jwt = require("jsonwebtoken");

module.exports = {
    verifyRole: (req, res, next) => {
        try {
            const user = req.user;
            const { role } = user;

            if(role !== 'collector'){
                return res.status(401).json({
                    status: 'failed',
                    message: 'You are not authorized to view this page.',
                });
            }
            next();
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                data: [],
                message: 'An internal server error occurred',
            });
        }
    }
};