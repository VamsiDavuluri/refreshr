import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './QuizSummary.css';

const QuizSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if state is not available
  if (!location.state) {
    navigate('/');
    return null;
  }

  const { score, total, answers } = location.state;
  const percentage = Math.round((score / total) * 100);

  const handleReview = () => {
    navigate('/results', { state: { score, total, answers } });
  };

  const handleReturn = () => {
    navigate('/subjects');
  };

  return (
    <div className="summary-page">
        <Header />
        <div className="summary-content">
            <h1 className="summary-title">Quiz Results</h1>

            <div className="score-box">
                <span className="score-label">Final Score</span>
                <span className="score-value">{percentage}%</span>
            </div>

            <div className="summary-actions">
                <button className="summary-btn primary" onClick={handleReturn}>
                    Return to Subjects
                </button>
                <button className="summary-btn secondary" onClick={handleReview}>
                    Review Answers
                </button>
            </div>
        </div>
    </div>
  );
};

export default QuizSummary;