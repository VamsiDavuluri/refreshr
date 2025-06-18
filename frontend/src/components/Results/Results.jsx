import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './Results.css';

const Results = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Guard clause to handle users navigating to this page directly
  if (!state || !state.answers || !state.answers.length) {
    return (
      <div className="results-page-container">
        <Header />
        <div className="results-content">
          <h2 style={{ textAlign: 'center', marginTop: '4rem' }}>No results to display.</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)'}}>Please complete a quiz first.</p>
          <button className="btn return-btn" onClick={() => navigate('/subjects')}>
            Select a Quiz
          </button>
        </div>
      </div>
    );
  }

  const { answers, score, total } = state;

  return (
    <div className="results-page-container">
      <Header />
      <div className="results-content">
        <h1 className="results-title">Your Quiz Review</h1>

        <div className="summary-box">
          <p>Total Questions: {total}</p>
          <p>Correct Answers: {score}</p>
          <p>Score: {Math.round((score / total) * 100)}%</p>
        </div>

        <div className="answers-list">
          {answers.map((q, idx) => (
            <div key={idx} className="question-card">
              <h3>
                Q{idx + 1}. {q.question}
              </h3>
              <p>
                <span className="label">Your Answer:</span>{' '}
                <span className={q.selected === q.answer ? 'correct' : 'incorrect'}>
                  {q.selected || 'Not Answered'}
                </span>
              </p>
              {/* Only show the correct answer if the user's choice was incorrect */}
              {q.selected !== q.answer && (
                <p>
                  <span className="label">Correct Answer:</span> <span className="correct">{q.answer}</span>
                </p>
              )}
              {/* Display the explanation for the correct answer */}
              <div className="explanation-box">
                <p>{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn return-btn" onClick={() => navigate('/subjects')}>
          Take Another Quiz
        </button>
      </div>
    </div>
  );
};

export default Results;