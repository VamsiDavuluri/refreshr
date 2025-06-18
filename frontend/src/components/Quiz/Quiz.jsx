import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import api from '../../utils/api';
import validSubjects from '../../constants/validSubjects';
import "./Quiz.css";

const saveQuizResult = async (resultData) => {
  try {
    await api.post('/results', resultData);
    console.log("Quiz result saved successfully to backend.");
  } catch (error) {
    if (error.response?.status !== 401 && error.response?.status !== 403) {
      console.error("Failed to save quiz result:", error);
    }
  }
};

const Quiz = () => {
  const { subject, quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      setError('');
      try {
        let quizData;

        if (location.state?.questions) {
          console.log("Loading questions from navigation state.");
          quizData = location.state.questions;
          setQuizTitle(location.state.title || 'Custom Quiz');
        } else if (quizId) {
          // FIX: Used backticks for template literal
          console.log(`Fetching generated quiz with ID: ${quizId}`);
          // FIX: API endpoint should be a string, not a regex
          const response = await api.get(`/quizzes/generated/${quizId}`);
          quizData = response.data.questions;
          setQuizTitle(response.data.title || 'Generated Quiz');
        } else if (subject) {
          if (!validSubjects.includes(subject)) {
            setError("Invalid subject selected. Please go back and choose a valid quiz.");
            setLoading(false);
            return;
          }

          // FIX: Used backticks for template literal
          console.log(`Fetching random quiz for subject: ${subject}`);
          // FIX: API endpoint should be a string, not a regex
          const response = await api.get(`/quizzes/${subject}`);
          quizData = response.data;
          // FIX: Used backticks for template literal
          setQuizTitle(`Quiz: ${subject.toUpperCase()}`);
        }

        if (quizData && quizData.length > 0) {
          setQuestions(quizData);
        } else {
          setError("Could not find any questions for this quiz.");
        }

      } catch (err) {
        setError("Failed to load quiz questions. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [subject, quizId, location.state]);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = async () => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    const currentScore = isCorrect ? score + 1 : score;

    const answerRecord = {
      question: questions[currentQuestion].question,
      selected: selectedOption,
      answer: questions[currentQuestion].answer,
      explanation: questions[currentQuestion].explanation,
    };

    const updatedAnswers = [...userAnswers, answerRecord];

    if (currentQuestion + 1 < questions.length) {
      setScore(currentScore);
      setUserAnswers(updatedAnswers);
      setSelectedOption("");
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalResult = {
        subject: subject || "custom", // Use a default if subject is null
        score: currentScore,
        total: questions.length,
      };

      await saveQuizResult(finalResult);

      navigate("/results-summary", {
        state: {
          score: currentScore,
          total: questions.length,
          answers: updatedAnswers,
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-content loading-container">
          <p>Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-content loading-container">
          <p className="error-text">{error}</p>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="quiz-page">
      <Navbar />
      <div className="quiz-content">
        <div className="progress-container">
          <p>{quizTitle}</p>
          <div className="progress-bar-outer">
            {/* FIX: Used backticks for style property string */}
            <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
          </div>
          <span>{currentQuestion + 1} / {questions.length}</span>
        </div>
        <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
        <div className="options-container">
          {questions[currentQuestion].options.map((option, index) => (
            // FIX: Used backticks for dynamic className string
            <label key={index} className={`option-card ${selectedOption === option ? 'selected' : ''}`}>
              <input
                type="radio"
                name="quiz-option"
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
              />
              <span className="custom-radio"></span>
              {option}
            </label>
          ))}
        </div>
        <div className="quiz-footer">
          <button className="next-btn" onClick={handleNext} disabled={!selectedOption}>
            {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;