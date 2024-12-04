const User = require('../../../models/User');
const asyncHandler = require('../../../utils/asyncHandler'); // Adjust the path as needed

// Controller function to get all Users
exports.getAllUsers = asyncHandler(async (req, res) => {
    // Fetch all Users from the database
    const users = await User.find({}, '-password').sort({ _id: -1 });

    res.json(users);
});

// Controller function to search for Users
exports.searchUsers = asyncHandler(async (req, res) => {
    const { name, email, role } = req.query;

    // Build the query object
    let query = {};

    // Regex Search for Name
    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Regex Search for Email
    if (email) {
        query.email = { $regex: email, $options: 'i' }; // Case-insensitive search
    }

    // Filter by role ('customer', 'admin')
    if (role) {
        query.role = role;
    }

    // Fetch all Users from the database that match the query
    const users = await User.find(query, '-password').sort({ _id: -1 });

    res.json(users);
});

// Controller function to create a new User
exports.createUser = asyncHandler(async (req, res) => {
    // Create a new User instance
    const user = new User(req.body);

    // Save the User instance to the database
    await user.save();

    res.json(user);
});

// Controller function to get a User by ID
exports.getUserById = asyncHandler(async (req, res) => {
    // Fetch the User by ID from the database
    const user = await User.findById(req.params.id, '-password');

    res.json(user);
});

// Controller function to update a User by ID
exports.updateUser = asyncHandler(async (req, res) => {
    // Update the User by ID with the new data from the request body
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
        '-password'
    );

    res.json(updatedUser);
});

// Controller function to delete a User by ID
exports.deleteUser = asyncHandler(async (req, res) => {
    // Delete the User by ID
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User deleted successfully' });
});

// Controller function to update caloriesBurned of a User by ID
exports.updateUserCalories = asyncHandler(async (req, res) => {
    // Extract the calories to add from the request body
    const { caloriesToAdd } = req.body;

    // Validate the input
    if (typeof caloriesToAdd !== 'number') {
        return res.status(400).json({ message: 'Invalid input: caloriesToAdd must be a number.' });
    }

    // Find the User by ID
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Update the caloriesBurned field by adding the new value to the existing one
    user.caloriesBurned += caloriesToAdd;

    // Save the updated user
    const updatedUser = await user.save();

    // Respond with the updated user
    res.json(updatedUser);
});