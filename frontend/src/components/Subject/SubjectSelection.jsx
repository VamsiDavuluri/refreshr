import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./SubjectSelection.css";

// Add the two new subjects to this array
const subjects = [
  { name: "Data Structures and Algorithms", icon: "</>", path: "/quiz/dsa" },
  { name: "Database Management Systems", icon: "🗄️", path: "/quiz/dbms" },
  { name: "Computer Networks", icon: "🌐", path: "/quiz/networks" },
  { name: "Operating Systems", icon: "⚙️", path: "/quiz/os" },
  { name: "Software Development", icon: "💻", path: "/quiz/dev" },
  { name: "Agile Software Development", icon: "🔄", path: "/quiz/agile" },
];

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Quizzes", path: "/subjects" },
];

const SubjectSelection = () => {
  const navigate = useNavigate();

  const handleStartQuiz = (path) => {
    navigate(path);
  };

  return (
    <div className="subject-page-container">
      <Navbar links={navLinks} />
      <div className="subject-selection-container">
        <h2 className="subject-title">Select a Subject</h2>
        <div className="subject-grid">
          {subjects.map((subject, index) => (
            <div
              className="subject-card"
              key={index}
              onClick={() => handleStartQuiz(subject.path)}
            >
              <div className="subject-icon">{subject.icon}</div>
              <div className="subject-name">{subject.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
