const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Bypassing for mock token
            if (token.startsWith('mock-jwt-token-')) {
                // Try to find any user to use as a mock, or use a default
                const mockUser = await User.findOne({ role: token.includes('admin') ? 'admin' : 'student' });
                req.user = mockUser || {
                    _id: '65c123456789012345678901', // Dummy ID
                    name: 'Mock User',
                    email: 'mock@example.com',
                    role: token.includes('admin') ? 'admin' : 'student'
                };
                return next();
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error('Auth error:', error.message);
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };
