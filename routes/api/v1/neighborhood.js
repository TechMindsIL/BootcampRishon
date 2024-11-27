const express = require('express');
const neighborhoodController = require('../../../controllers/api/v1/neighborhood'); // Import the controller
const validateObjectId = require('../../../middleware/validateObjectId'); // Import the validateObjectId middleware
const SecurityMiddleware = require('../../../middleware/securityMiddleware'); // Import the security middleware
const router = express.Router();

// Get all neighborhoods
router.get('/', neighborhoodController.getAllNeighborhood);

// Get a single neighborhood by ID
router.get('/:id', SecurityMiddleware.secure(), validateObjectId('id'), neighborhoodController.getNeighborhoodById);

// Handles any neighborhood errors
router.use((err, req, res, next) => {
    if (req.method === 'GET' && req.path === '/') {
        console.error("Error fetching neighborhoods");
    } else if (req.method === 'GET' && req.path.startsWith('/:id')) {
        console.error("Error fetching a neighborhood");
    } else {
        console.error("Neighborhood error: ", err.message);
    }
    res.status(500).json({ error: 'An internal server error occurred' });
});

module.exports = router;