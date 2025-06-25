// backend/server.js

// --- Basic Setup ---
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- Import our new modules ---
const { authenticateToken } = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
// (Assuming you still have results logic here for now)

const app = express();
const PORT = process.env.PORT || 5000;

// --- Core Middleware ---
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


// ===================================
//          API ROUTES
// ===================================

// Use the new routers. All routes in authRoutes will be prefixed with /api/auth
app.use('/api/auth', authRoutes);

// All routes in quizRoutes will be prefixed with /api/quizzes
app.use('/api/quizzes', quizRoutes);

// --- Protected Routes can remain here or be moved ---
// We can move these to a new 'resultsRoutes.js' file in the future if needed.
const path = require('path');
const fs = require('fs');
const DB_PATH = path.join(__dirname, 'database.json');
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');

// POST /api/results
app.post('/api/results', authenticateToken, (req, res) => {
    try {
        const { subject, score, total } = req.body;
        const userId = req.user.id;
        if (subject == null || score == null || total == null) {
            return res.status(400).json({ message: "Missing required result data." });
        }
        const db = readDB();
        const newResult = {
            resultId: (db.quizResults.length > 0 ? Math.max(...db.quizResults.map(r => r.resultId)) : 0) + 1,
            userId, subject, score, total,
            date: new Date().toISOString()
        };
        db.quizResults.push(newResult);
        writeDB(db);
        res.status(201).json({ message: 'Quiz result saved successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while saving result.' });
    }
});

// GET /api/my-results
app.get('/api/my-results', authenticateToken, (req, res) => {
    try {
        console.log("Authenticated user ID:", req.user.id);
        const db = readDB();
        const userId = req.user.id;
        const userResults = db.quizResults
            .filter(result => result.userId === userId)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json(userResults);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching results.' });
    }
});

// EXPORT THE EXPRESS APP INSTANCE
//module.exports = app;
// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
