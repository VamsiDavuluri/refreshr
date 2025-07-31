// frontend/src/components/Quiz/Quiz.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../Navbar/Navbar';      // <-- THE CORRECT PATH (One level up)
import api from '../../api';         // <-- THE CORRECT PATH (Two levels up)
import "./Quiz.css";

// Helper function to save the quiz results
const saveQuizResult = async (resultData) => {
    try {
        await api.post('/api/results', resultData);
        console.log("Quiz result saved.");
    } catch (error) {
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error("Failed to save quiz result:", error);
        }
    }
};

const Quiz = () => {
    const { subject } = useParams();
    const navigate = useNavigate();

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
                const response = await api.get(`/api/quizzes/${subject}`);
                if (response.data && response.data.length > 0) {
                    setQuestions(response.data);
                    setQuizTitle(`Quiz: ${subject.toUpperCase()}`);
                } else {
                    setError("Could not find any questions for this quiz.");
                }
            } catch (err) {
                setError("Failed to load quiz questions. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        if (subject) {
            fetchQuizData();
        }
    }, [subject]);

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
            const finalResult = { subject, score: currentScore, total: questions.length };
            await saveQuizResult(finalResult);
            navigate("/results-summary", {
                state: { score: currentScore, total: questions.length, answers: updatedAnswers },
            });
        }
    };

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
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

    return (
        <div className="quiz-page">
            <Navbar />
            <div className="quiz-content">
                <div className="progress-container">
                    <p>{quizTitle}</p>
                    <div className="progress-bar-outer">
                        <div className="progress-bar-inner" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
                    </div>
                    <span>{currentQuestion + 1} / {questions.length}</span>
                </div>
                <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
                <div className="options-container">
                    {questions[currentQuestion].options.map((option, index) => (
                        <label key={index} className={`option-card ${selectedOption === option ? 'selected' : ''}`}>
                            <input type="radio" name="quiz-option" value={option} checked={selectedOption === option} onChange={handleOptionChange}/>
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