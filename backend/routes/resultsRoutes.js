const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('../middleware/authMiddleware');

// Path: POST /api/results
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { subject, score, total } = req.body;
        const userId = req.user.id;
        await db.query(
            'INSERT INTO quiz_results (user_id, subject, score, total) VALUES ($1, $2, $3, $4)',
            [userId, subject, score, total]
        );
        res.status(201).json({ message: 'Quiz result saved successfully!' });
    } catch (error) {
        console.error("Error saving result:", error);
        res.status(500).json({ message: 'Server error while saving result.' });
    }
});

// Path: GET /api/results/my-results
router.get('/my-results', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const results = await db.query('SELECT * FROM quiz_results WHERE user_id = $1 ORDER BY date DESC', [userId]);
        res.status(200).json(results.rows);
    } catch (error) {
        console.error("Error fetching results:", error);
        res.status(500).json({ message: 'Server error while fetching results.' });
    }
});

module.exports = router;