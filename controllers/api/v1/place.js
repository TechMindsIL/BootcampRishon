const Place = require('../../../models/Place'); // Import the Place model
const asyncHandler = require('../../../utils/asyncHandler'); // Adjust the path as needed

// Controller function to get all Places
exports.getAllPlaces = asyncHandler(async (req, res) => {
    // Fetch all Places from the database
    const places = await Place.find()
        .sort({ _id: -1 })
        .limit(1000)
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        });

    res.json(places);
});

// Controller function to get Places by query
exports.getPlaceByQuery = asyncHandler(async (req, res) => {
    const { name, tags, isRelevant } = req.query;

    // Build the query object
    let query = {};

    // Regex Search for Name
    if (name) {
        query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    // Tag Array Matching
    if (tags) {
        query.tags = { $all: tags.split(',') }; // Assuming tags are provided as a comma-separated string
    }

    // Boolean Filter for isRelevant
    if (isRelevant !== undefined) {
        query.isRelevant = isRelevant === 'true'; // Convert string to boolean
    }

    // Fetch all Routes from the database that match the query
    const routes = await Place.find(query)
        .sort({ _id: -1 })
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .populate('coordinates');

    res.json(routes);
});

// Controller function to create a new Place
exports.createPlace = asyncHandler(async (req, res) => {
    if (req.file) {
        req.body.img = req.file.path;
    }


    // because FormData accepts only strings and files, we need to convert the coordinates to an array
    // if the coordinates are a string
    // We also need to check if the coordinates are a string and if they include a comma
    // and if the split array has a length of 2
    if (typeof req.body.coordinates == 'string' &&
        req.body.coordinates.includes(',') &&
        req.body.coordinates.split(',').length == 2) {

        // if all conditions match, we split the coordinates string into an array
        let coordinates = req.body.coordinates.split(',');

        // then we convert the coordinates array into an object that has longitude and latitude properties
        req.body.coordinates = {
            longitude: parseFloat(coordinates[0]),
            latitude: parseFloat(coordinates[1])
        };
    }

    // Create a new Place instance
    const place = new Place(req.body);

    // Save the Place instance to the database
    await place.save();

    res.json(place);
});

// Controller function to get a Place by ID
exports.getPlaceById = asyncHandler(async (req, res) => {
    // Fetch the Place by ID from the database
    const place = await Place.findById(req.params.id)
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        });

    res.json(place);
});

// Controller function to update a Place by ID
exports.updatePlace = asyncHandler(async (req, res) => {
    // Update the Place by ID with the new data from the request body
    const updatedPlace = await Place.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedPlace);
});

// Controller function to delete a Place by ID
exports.deletePlace = asyncHandler(async (req, res) => {
    // Delete the Place by ID
    await Place.findByIdAndDelete(req.params.id);

    res.json({ message: 'Place deleted successfully' });
});