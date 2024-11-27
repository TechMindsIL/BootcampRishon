const Neighborhood = require('../../../models/Neighborhood');
const asyncHandler = require('../../../utils/asyncHandler.js'); // Adjust the path as needed

// Controller function to get all Neighborhood
exports.getAllNeighborhood = asyncHandler(async (req, res) => {
    // Fetch all Neighborhood from the database
    const neighborhood = await Neighborhood.find().sort({ _id: -1 });
    res.json(neighborhood);
});

// Controller function to get a Neighborhood by ID
exports.getNeighborhoodById = asyncHandler(async (req, res) => {
    // Fetch the Neighborhood by ID from the database
    const neighborhood = await Neighborhood.findById(req.params.id);
    res.json(neighborhood);
});