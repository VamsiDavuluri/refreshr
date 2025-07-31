// backend/routes/authRoutes.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Path: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, hashedPassword]);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Path: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        // --- THIS IS THE REAL TOKEN GENERATION LOGIC ---
         const payload = {
            id: user.id,
            email: user.email,
            name: user.name // <-- Add the name here
        };

        // 2. Sign the new payload to create the token.
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;