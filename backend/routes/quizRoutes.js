// backend/routes/quizRoutes.js
const express = require("express");
const axios = require("axios"); // We can keep this for dynamic questions from a simple API
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
  const categoryMap = {
    dsa: "science",
    dbms: "science",
    networks: "science",
    os: "science",
    dev: "history",
    agile: "history",
  };

  const subject = req.params.subject;
  const category = categoryMap[subject] || "science";
  const apiUrl = `https://the-trivia-api.com/v2/questions?limit=15&categories=${category}&difficulties=hard`;

  try {
    const response = await axios.get(apiUrl);

    // Transform the data to match our frontend's expected format
    const formattedQuestions = response.data.map((q) => {
      const allOptions = shuffleArray([...q.incorrectAnswers, q.correctAnswer]);
      return {
        question: q.question.text,
        options: allOptions,
        answer: q.correctAnswer,
        explanation: `The correct answer is ${q.correctAnswer}. This is a verified fact from our trivia source.`,
      };
    });

    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error("Error fetching from The Trivia API:", error.message);
    res.status(500).json({ message: "Failed to fetch quiz questions." });
  }
});

module.exports = router;
