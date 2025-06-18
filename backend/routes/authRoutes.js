const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// --- Constants ---
const DB_PATH = path.join(__dirname, '..', 'database.json');
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-random';

// Helper functions (could also be moved to a db.js helper file for even cleaner code)
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');

// --- API ROUTES ---

// Route: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();
        if (db.users.find(user => user.email === email)) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: (db.users.length > 0 ? Math.max(...db.users.map(u => u.id)) : 0) + 1,
            email,
            password: hashedPassword
        };
        db.users.push(newUser);
        writeDB(db);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

// Route: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const db = readDB();
        const user = db.users.find(u => u.email === email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

module.exports = router;