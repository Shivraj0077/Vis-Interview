const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Static Officer Login Check
    if (email === 'officer@eduverify.com' && password === 'officer@pass123') {
        // Find or create the static officer in DB for consistency
        let officer = await User.findOne({ email: 'officer@eduverify.com' });
        if (!officer) {
            officer = await User.create({
                name: 'Chief Officer',
                email: 'officer@eduverify.com',
                password: 'officer@pass123', // Will be hashed but we check plain text above
                role: 'admin'
            });
        }
        
        return res.json({
            _id: officer._id,
            name: officer.name,
            email: officer.email,
            role: officer.role,
            token: generateToken(officer._id),
        });
    }

    // 2. Dynamic Student/User Login
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

module.exports = { registerUser, loginUser };
