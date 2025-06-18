import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../src/utils/api";
import Navbar from "../components/Navbar/Navbar";
import "./MyAttempts.css";

// Helper to format the subject names nicely for past attempts
const formatSubjectName = (key) => {
  const names = {
    dsa: "Data Structures & Algorithms",
    dbms: "Database Management Systems",
    networks: "Computer Networks",
    os: "Operating Systems",
    dev: "Software Development",
    agile: "Agile Software Development",
  };
  // For generated quizzes, the key might be the quizId
  return names[key] || key.replace("gen_", "Custom Quiz ");
};

const MyAttempts = () => {
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [generatedQuizzes, setGeneratedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const p1 = api.get("/my-results");
      const p2 = api.get("/my-generated-quizzes");

      try {
        // Fetch both past results and the list of generated quizzes in parallel
        const [resultsRes, quizzesRes] = await Promise.all([p1, p2]);
        setAttempts(resultsRes.data);
        setGeneratedQuizzes(quizzesRes.data);
      } catch (error) {
        console.error("Failed to load user data", error);
        // The API interceptor will handle auth errors, so we don't need to set an error state here.
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleStartCustomQuiz = async (quiz) => {
    // We can navigate directly to the quiz page and pass the quiz title in the state
    // The Quiz component will then fetch the full quiz data using the quizId from the URL
    navigate(`/quiz/custom/${quiz.quizId}`, { state: { title: quiz.title } });
  };

  // --- THIS IS THE FIX ---
  // Define the navLinks constant before using it in the JSX
  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Quizzes", path: "/subjects" },
  ];

  return (
    <div className="attempts-page-container">
      <Navbar links={navLinks} />
      <div className="attempts-content">
        {/* Generated Quizzes Section */}
        <h1 className="attempts-title">My Generated Quizzes</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="attempts-list">
            {generatedQuizzes.length === 0 ? (
              <p>
                You haven't generated any quizzes from a PDF yet. Try the
                "Create Quiz" page!
              </p>
            ) : (
              generatedQuizzes.map((quiz) => (
                <div key={quiz.quizId} className="attempt-card generated">
                  <div className="attempt-header">
                    <h2 className="attempt-subject">{quiz.title}</h2>
                    <span className="attempt-date">
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="attempt-score">
                    <span>{quiz.questionCount} Questions</span>
                    <button
                      onClick={() => handleStartCustomQuiz(quiz)}
                      className="start-custom-quiz-btn"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Past Attempts Section */}
        <h1 className="attempts-title" style={{ marginTop: "3rem" }}>
          My Past Attempts
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="attempts-list">
            {attempts.length === 0 ? (
              <p>You haven't taken any pre-made quizzes yet!</p>
            ) : (
              attempts.map((attempt) => (
                <div key={attempt.resultId} className="attempt-card">
                  <div className="attempt-header">
                    <h2 className="attempt-subject">
                      {formatSubjectName(attempt.subject)}
                    </h2>
                    <span className="attempt-date">
                      {new Date(attempt.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="attempt-score">
                    <p>
                      Score:{" "}
                      <strong>
                        {Math.round((attempt.score / attempt.total) * 100)}%
                      </strong>
                    </p>
                    <span>
                      ({attempt.score}/{attempt.total} correct)
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttempts;
