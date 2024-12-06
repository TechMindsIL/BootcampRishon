const Tag = require('../../../models/Tag'); // Import the Tag model
const asyncHandler = require('../../../utils/asyncHandler.js'); // Adjust the path as needed

// Controller function to get all Tags
exports.getAllTags = asyncHandler(async (req, res) => {
    // Fetch all Tags from the database
    const tags = await Tag.find()
        .populate('category')
        .sort({ _id: -1 });

    res.json(tags);
});

// Controller function to search for Tags
exports.searchTags = asyncHandler(async (req, res) => {
    // Fetch all Tags from the database that match the search query
    const { name, categories,isRelevant } = req.query;
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (categories) query.category = { $in: categories.split(',') };
    
    if (isRelevant !== undefined) {
        query.isRelevant = isRelevant === 'true'; // Convert string to boolean
    }
    
    const tags = await Tag.find(query)
        .populate('category');

    res.json(tags);
});

// Controller function to create a new Tag
exports.createTag = asyncHandler(async (req, res) => {
    // Create a new Tag instance
    const tag = new Tag(req.body);

    // Save the Tag instance to the database
    await tag.save();

    await tag.populate('category');

    res.json(tag);
});

// Controller function to get a Tag by ID
exports.getTagById = asyncHandler(async (req, res) => {
    // Fetch the Tag by ID from the database
    const tag = await Tag.findById(req.params.id)
        .populate('category');

    res.json(tag);
});

// Controller function to update a Tag by ID
exports.updateTag = asyncHandler(async (req, res) => {
    // Update the Tag by ID with the new data from the request body
    const updatedTag = await Tag.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    ).populate('category');

    res.json(updatedTag);
});

// Controller function to delete a Tag by ID
exports.deleteTag = asyncHandler(async (req, res) => {
    await Tag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag deleted successfully' });
});

// Controller function to get all Tags for a Category
exports.getTagsForCategory = asyncHandler(async (req, res) => {
    // Fetch all Tags for the Category by ID from the database
    const tags = await Tag.find({ category: req.params.id });
    res.json(tags);
});