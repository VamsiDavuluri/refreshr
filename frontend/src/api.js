// src/api.js

import axios from 'axios';

// 1. Create a new instance of axios with a custom configuration.
// The baseURL is the root address of your backend server.
// This is the most important line to fix the error.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
});

// 2. Request Interceptor: This function runs BEFORE every API request is sent.
api.interceptors.request.use(
  (config) => {
    // Get the authentication token from localStorage.
    const token = localStorage.getItem('token');
    
    // If a token exists, add it to the 'Authorization' header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor: This function runs AFTER an API response is received.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check for authentication errors (e.g., expired token).
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
      alert("Your session has expired. Please log in again.");
    }
    
    return Promise.reject(error);
  }
);

export default api;