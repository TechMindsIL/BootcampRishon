const express = require('express');
const authController = require('../../../controllers/api/v1/auth');
const auth = require('../../../middleware/auth');
const SecurityMiddleware = require('../../../middleware/securityMiddleware');
const router = express.Router();

// Auth routes
router.post('/register', authController.register); // Allow registration without security check
router.post('/login', authController.login); // Allow login without security check
router.post('/logout', SecurityMiddleware.secure(), authController.logout);

// Get user profile
router.get('/', auth, authController.profile);

// Update name, password, and email
router.put('/', SecurityMiddleware.secure(), auth, authController.update);

// Handles any auth errors
router.use((err, req, res, next) => {
    if (req.method === 'POST' && req.path === '/register') {
        console.error("Error registering a user");
    } else if (req.method === 'POST' && req.path === '/login') {
        console.error("Error logging in a user");
    } else if (req.method === 'POST' && req.path === '/logout') {
        console.error("Error logging out a user");
    } else if (req.method === 'GET' && req.path === '/') {
        console.error("Error fetching user profile");
    } else if (req.method === 'PUT' && req.path === '/') {
        console.error("Error updating user profile");
    } else {
        console.error("Auth error: ", err.message);
    }
    res.status(500).json({ error: 'An internal server error occurred' });
});

module.exports = router;
