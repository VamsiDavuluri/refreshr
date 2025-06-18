// backend/routes/quizRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path"); // ✅ ADD THIS LINE
const router = express.Router();

// Helper function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// This is now the ONLY route in this file.
// It fetches data from The Trivia API as a placeholder for dynamic, non-local questions.
router.get("/:subject", async (req, res) => {
  // Map our subjects to categories the external API understands
const subject = req.params.subject.toLowerCase();
  const validSubjects = [
    "dsa",
    "dbms",
    "os",
    "agile",
    "dev",
    "networks",
  ];

  if (!validSubjects.includes(subject)) {
    return res.status(400).json({ message: "Invalid subject." });
  }
  const filePath = path.join(__dirname, `../questions/${subject}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "Quiz file not found." });
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    let questions = JSON.parse(fileContent);

    questions = questions.map((q) => ({
      ...q,
      options: shuffleArray([...q.options]),
    }));

    res.json(questions.slice(0, 15));

  } catch (error) {
    console.error("Error reading quiz file:", err.message);
    res.status(500).json({ message: "Server error loading quiz." });
  }
});

module.exports = router;
