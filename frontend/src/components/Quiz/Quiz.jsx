import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import api from '../../utils/api'; // Use our centralized API handler
import "./Quiz.css";

// Helper function to save the quiz results to the backend
const saveQuizResult = async (resultData) => {
    try {
        await api.post('/results', resultData);
        console.log("Quiz result saved successfully to backend.");
    } catch (error) {
        // The global interceptor in api.js will handle auth errors (401/403)
        if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error("Failed to save quiz result:", error);
        }
    }
};

const Quiz = () => {
    const { subject, quizId } = useParams(); // Can get either 'subject' or 'quizId' from the URL
    const navigate = useNavigate();
    const location = useLocation(); // Used to get questions passed directly via state

    // State for the quiz data and loading/error status
    const [questions, setQuestions] = useState([]);
    const [quizTitle, setQuizTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State for the quiz progress
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState("");
    const [score, setScore] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);

    // This effect fetches the appropriate quiz data based on the URL or navigation state
    useEffect(() => {
        const fetchQuizData = async () => {
            setLoading(true);
            setError('');
            try {
                let quizData;
                // Priority 1: Check if questions were passed directly in the navigation state.
                if (location.state?.questions) {
                    console.log("Loading questions from navigation state.");
                    quizData = location.state.questions;
                    setQuizTitle(location.state.title || 'Custom Quiz');
                }
                // Priority 2: If there's a quizId, fetch that specific generated quiz.
                else if (quizId) {
                    console.log(`Fetching generated quiz with ID: ${quizId}`);
                    const response = await api.get(`/quizzes/generated/${quizId}`);
                    quizData = response.data.questions;
                    setQuizTitle(response.data.title || 'Generated Quiz');
                }
                // Priority 3: If there's a subject, fetch a random quiz for it.
                else if (subject) {
                    console.log(`Fetching random quiz for subject: ${subject}`);
                    const response = await api.get(`/quizzes/${subject}`);
                    quizData = response.data;
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
                subject: subject || quizId, // Use subject or quizId as an identifier
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
                        <div className="progress-bar-inner" style={{ width: `${progress}%` }}></div>
                    </div>
                    <span>{currentQuestion + 1} / {questions.length}</span>
                </div>
                <h2 className="quiz-question">{questions[currentQuestion].question}</h2>
                <div className="options-container">
                    {questions[currentQuestion].options.map((option, index) => (
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