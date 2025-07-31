// backend/server.js

// --- Basic Setup ---
require('dotenv').config(); 
const express = require('express');
const cors = require('cors');

// --- Import Your Routers ---
// This tells the server to use the logic from your separate route files.
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resultsRoutes = require('./routes/resultsRoutes');

const app = express();
const PORT = process.env.PORT || 5001; // Using 5001 to avoid Mac port conflicts

// ===================================
//          CORE MIDDLEWARE
// ===================================

// This is the correct, robust CORS setup.
app.use(cors());

// This is the body parser.
app.use(express.json());


// ===================================
//          API ROUTES
// ===================================

// This mounts your routers on their correct base paths.
app.use('/api/auth', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultsRoutes);


// ===================================
//      Start the Server
// ===================================
app.listen(PORT, () => {
  console.log(`✅ Backend server is running and listening on http://localhost:${PORT}`);
});