import React, { useState, useEffect } from "react";

import api from "../api";
import Navbar from "../components/Navbar/Navbar";
import "./MyAttempts.css";

// Helper to format subject names nicely
const formatSubjectName = (key) => {
  const names = {
    dsa: "Data Structures & Algorithms",
    dbms: "Database Management Systems",
    networks: "Computer Networks",
    os: "Operating Systems",
    dev: "Software Development",
    agile: "Agile Software Development",
  };
  return names[key] || key.replace("gen_", "Custom Quiz ");
};

const MyAttempts = () => {

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
        setLoading(true);
        // --- THE FIX IS HERE ---
        // The path is now '/api/results/my-results'
        const p1 = api.get('/api/results/my-results'); 
        
        // This route for generated quizzes is likely in quizRoutes.js, so its path is fine.
        try {
            const [resultsRes] = await Promise.all([p1]);
            setAttempts(resultsRes.data);
        } catch (error) {
            console.error("Failed to load user data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchAllData();
}, []);

  const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Quizzes", path: "/subjects" },
  ];

  return (
    <div className="attempts-page-container">
      <Navbar links={navLinks} />
      <div className="attempts-content">
        <h1 className="attempts-title">My Past Attempts</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="attempts-list">
            {attempts.length === 0 ? (
              <p>You haven't taken any quizzes yet!</p>
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