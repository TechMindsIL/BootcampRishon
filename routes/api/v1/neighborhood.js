const express = require('express');
const neighborhoodController = require('../../../controllers/api/v1/neighborhood'); // Import the controller
const validateObjectId = require('../../../middleware/validateObjectId'); // Import the validateObjectId middleware
const SecurityMiddleware = require('../../../middleware/securityMiddleware'); // Import the security middleware
const router = express.Router();

// Route to get all neighborhoods
router.get('/', neighborhoodController.getAllNeighborhood);

// Route to get a Neighborhood by ID
router.get('/:id', SecurityMiddleware.secure(), validateObjectId('id'), neighborhoodController.getNeighborhoodById);

// Route to update caloriesBurned of a Neighborhood by ID 
router.put('/calories/:id', SecurityMiddleware.secure(), validateObjectId('id'), neighborhoodController.updateNeighborhoodCalories);

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