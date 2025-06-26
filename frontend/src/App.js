// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth Pages
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import Register from "./pages/Register";

// App Components
import Home from "./components/Home/Home";
import SubjectSelection from "./components/Subject/SubjectSelection";
import Quiz from "./components/Quiz/Quiz";
import QuizSummary from "./components/Quiz/QuizSummary";
import Results from "./components/Results/Results";
import ProtectedRoute from "./components/Routes/ProtectedRoute";
import MyAttempts from "./pages/MyAttempts";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute><SubjectSelection /></ProtectedRoute>} />
        <Route path="/my-attempts" element={<ProtectedRoute><MyAttempts /></ProtectedRoute>} />
        <Route path="/quiz/:subject" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/quiz/custom/:quizId" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/results-summary" element={<ProtectedRoute><QuizSummary /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;