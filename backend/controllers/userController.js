import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// @ desc Register User
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {

    if (!req.body || !req.body.name || !req.body.email || !req.body.password)
    {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists)
    {
        res.status(400);
        throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,

    });

    if (user)
    {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        });
    } else
    {
        res.status(400);
        throw new Error('Invalid user data');
    }


});

// @ desc Authenticate User
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password)
    {
        res.status(400);
        throw new Error('Please add all fields');
    }
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user)
    {
        res.status(400);
        throw new Error('Invalid credentials');
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch)
    {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)

        });
    }
    else
    {
        res.status(400);
        throw new Error('Invalid credentials');
    }
});

// @ desc Get User data
// @route GET /api/users/me
// @access Private

const getUserData = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user)
    {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else
    {
        res.status(404);
        throw new Error('User not found');
    }

});

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export {
    registerUser,
    loginUser,
    getUserData
}