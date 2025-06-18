const jwt = require('jsonwebtoken');

// Get the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-is-long-and-random';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        // No token provided, send 401 Unauthorized
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Token is invalid (e.g., expired or tampered with), send 403 Forbidden
            return res.status(403).json({ message: "Invalid or expired token." });
        }
        
        // If the token is valid, attach the decoded user payload to the request object
        req.user = user;
        next(); // Proceed to the next middleware or the route handler
    });
};

module.exports = { authenticateToken };