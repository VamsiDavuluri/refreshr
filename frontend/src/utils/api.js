

import axios from 'axios';

// Create a new instance of axios with a custom configuration
const api = axios.create({
  // baseURL: '/api',
  baseURL: 'http://localhost:3001/api', // Base URL for all API requests baseURL: '/api'
});

// --- Request Interceptor ---
// This runs BEFORE every request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This runs AFTER a response is received.
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error is due to an expired/invalid token (401 or 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log("Authentication error, logging out...");
      // Remove the invalid token
      localStorage.removeItem('token');
      // Redirect the user to the login page
      // Using window.location.href forces a full page reload, clearing any component state.
      window.location.href = '/login'; 
      alert("Your session has expired. Please log in again.");
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);

export default api;