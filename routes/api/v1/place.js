const express = require('express');
const placeController = require('../../../controllers/api/v1/place'); // Import the controller
const auth = require('../../../middleware/auth'); // Import the auth middleware
const checkRole = require('../../../middleware/role'); // Import the role middleware
const validateObjectId = require('../../../middleware/validateObjectId'); // Import the validateObjectId middleware
const SecurityMiddleware = require('../../../middleware/securityMiddleware'); // Import the security middleware
const router = express.Router();

const uploadService = require("../../../services/upload.service").getInstance({ pathDest: `./uploads/pictures` });

// Route to get all Places
router.get('/', placeController.getAllPlaces);

// Route to get a Place by query
router.get('/search', SecurityMiddleware.secure(), placeController.getPlaceByQuery);

// Route to get a Place by ID
router.get('/:id', SecurityMiddleware.secure(), validateObjectId('id'), placeController.getPlaceById);

// Route to create a new Place
router.post('/', SecurityMiddleware.secure(), auth, checkRole('admin'), uploadService.single('img'), placeController.createPlace);

// Route to update a Place by ID
router.put('/:id', SecurityMiddleware.secure(), auth, checkRole('admin'), validateObjectId('id'), placeController.updatePlace);

// Route to delete a Place by ID
router.delete('/:id', SecurityMiddleware.secure(), auth, checkRole('admin'), validateObjectId('id'), placeController.deletePlace);

// Handles any Place errors
router.use((err, req, res, next) => {
    if (req.method === 'GET' && req.path === '/') {
        console.error("Error fetching Places");
    } else if (req.method === 'GET' && req.path === '/search') {
        console.error("Error fetching a Place by query");
    } else if (req.method === 'POST' && req.path === '/') {
        console.error("Error creating a Place");
    } else if (req.method === 'GET' && req.path.startsWith('/:id')) {
        console.error("Error fetching a Place");
    } else if (req.method === 'PUT' && req.path.startsWith('/:id')) {
        console.error("Error updating a Place");
    } else if (req.method === 'DELETE' && req.path.startsWith('/:id')) {
        console.error("Error deleting a Place");
    } else {
        console.error("Place error: ", err.message);
    }
    res.status(500).json({ error: 'An internal server error occurred' });
});

module.exports = router;