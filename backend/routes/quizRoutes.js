const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Path: GET /api/quizzes/:subject
router.get("/:subject", (req, res) => {
    try {
        const subject = req.params.subject.toLowerCase();
        const filePath = path.join(__dirname, `../questions/${subject}.json`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Quiz file not found." });
        }
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const questions = JSON.parse(fileContent);
        const selectedQuestions = shuffleArray(questions).slice(0, 15);
        res.json(selectedQuestions);
    } catch (error) {
        console.error("Error in quiz route:", error);
        res.status(500).json({ message: "Server error loading quiz." });
    }
});

module.exports = router;