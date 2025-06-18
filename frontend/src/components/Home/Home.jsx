import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Home.css";

const navLinks = [
    { name: "Home", path: "/home" },
    { name: "Quizzes", path: "/subjects" },

];

// src/components/Home.jsx

// ... (imports are the same)

// ... (navLinks array is the same)

function Home() {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/subjects");
  };

  return (
    <div className="home-container">
      {/* --- Remove the showLogout prop from here --- */}
      <Navbar links={navLinks} />
      <main className="home-main">
        <h1>Welcome to refreshr</h1>
        <p>
          Sharpen your knowledge with our interactive quizzes. Start a new quiz
          or continue where you left off.
        </p>
        <button className="home-start-btn" onClick={handleStart}>
          Start New Quiz
        </button>
      </main>
    </div>
  );
}

export default Home;