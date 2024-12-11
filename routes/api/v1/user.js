const express = require('express');
const userController = require('../../../controllers/api/v1/user'); // Import the controller
const auth = require('../../../middleware/auth'); // Import the auth middleware
const checkRole = require('../../../middleware/role'); // Import the role middleware
const validateObjectId = require('../../../middleware/validateObjectId'); // Import the validateObjectId middleware
const SecurityMiddleware = require('../../../middleware/securityMiddleware'); // Import the security middleware
const router = express.Router();

// Route to get all users
router.get('/', auth, checkRole('admin'), userController.getAllUsers);

// Route to search for users
router.get('/search', SecurityMiddleware.secure(), auth, checkRole('admin'), userController.searchUsers);

// Route to get a user by ID
router.get('/:id', SecurityMiddleware.secure(), auth, checkRole('admin'), validateObjectId('id'), userController.getUserById);

// Route to create a new user
router.post('/', SecurityMiddleware.secure(), auth, checkRole('admin'), userController.createUser);

// Route to update a user by ID
router.put('/:id', SecurityMiddleware.secure(), auth, checkRole('admin'), validateObjectId('id'), userController.updateUser);

// Route to delete a user by ID
router.delete('/:id', SecurityMiddleware.secure(), auth, checkRole('admin'), validateObjectId('id'), userController.deleteUser);

// Handles any user errors
router.use((err, req, res, next) => {
    if (req.method === 'GET' && req.path === '/') {
        console.error("Error fetching users");
    } else if (req.method === 'POST' && req.path === '/') {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
            console.error("Error creating a user: Email already exists");
            res.status(400).json({ error: 'Email already exists' });
        } else {
            console.error("Error creating a user");
            console.error(err, res);
            res.status(500).json({ error: 'An internal server error occurred' });
        }
    } else if (req.method === 'GET' && req.path.startsWith('/:id')) {
        console.error("Error fetching a user");
    } else if (req.method === 'PUT' && req.path.startsWith('/:id')) {
        console.error("Error updating a user");
    } else if (req.method === 'DELETE' && req.path.startsWith('/:id')) {
        console.error("Error deleting a user");
    } else {
        console.error("User error: ", err.message);
        res.status(500).json({ error: 'An internal server error occurred' });
    }
});

module.exports = router;
