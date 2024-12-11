const Neighborhood = require('../../../models/Neighborhood');
const asyncHandler = require('../../../utils/asyncHandler.js'); // Adjust the path as needed

// Controller function to get all Neighborhood
exports.getAllNeighborhood = asyncHandler(async (req, res) => {
    // Fetch all Neighborhood from the database
    const neighborhood = await Neighborhood.find().sort({ title: 1 });
    res.json(neighborhood);
});

// Controller function to get a Neighborhood by ID
exports.getNeighborhoodById = asyncHandler(async (req, res) => {
    // Fetch the Neighborhood by ID from the database
    const neighborhood = await Neighborhood.findById(req.params.id);
    res.json(neighborhood);
});

// Controller function to update caloriesBurned of a Neighborhood by ID
exports.updateNeighborhoodCalories = asyncHandler(async (req, res) => {
    // Extract the calories to add from the request body
    const { caloriesToAdd } = req.body;

    // Validate the input
    if (typeof caloriesToAdd !== 'number') {
        return res.status(400).json({ message: 'Invalid input: caloriesToAdd must be a number.' });
    }

    // Find the neighborhood by ID
    const neighborhood = await Neighborhood.findById(req.params.id);
    if (!neighborhood) {
        return res.status(404).json({ message: 'Neighborhood not found.' });
    }

    // Update the caloriesBurned field by adding the new value to the existing one
    neighborhood.caloriesBurned += caloriesToAdd;

    if (neighborhood.activitiesFinished == null) {
        neighborhood.activitiesFinished = 0;
    }
    neighborhood.activitiesFinished += 1;

    // Save the updated neighborhood
    const updatedNeighborhood = await neighborhood.save();

    // Respond with the updated neighborhood
    res.json(updatedNeighborhood);
});