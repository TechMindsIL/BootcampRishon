const User = require('../../../models/User');
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

    // check if we receive a file from the request
    if (req.file) {
        // we set the domain name of our server, where the image is stored
        let fullPath = process.env.DOMAIN_URL + '/' + req.file.path;
        req.body.img = fullPath;
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

    // set body isRelevant to true or false based on the string value
    // FormData doesn't support boolean values, so we need to convert the string to a boolean
    req.body.isRelevant = req.body.isRelevant === 'true';

    // check whether we receive tags as a string and if it has a length greater than 0
    // if yes, we split the string into an array to get individual ID's of each tags, and assign it 
    // to the tags property of the body
    if (req.body.tags && req.body.tags.length > 0) {
        req.body.tags = req.body.tags.split(',');
    }else {
        req.body.tags = []; // Set an empty array if no valid tags exist
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
    // check if we receive a file from the request
    if (req.file) {
        // we set the domain name of our server, where the image is stored
        let fullPath = process.env.DOMAIN_URL + '/' + req.file.path;
        req.body.img = fullPath;
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

    // set body isRelevant to true or false based on the string value
    // FormData doesn't support boolean values, so we need to convert the string to a boolean
    req.body.isRelevant = req.body.isRelevant === 'true';

    // check whether we receive tags as a string and if it has a length greater than 0
    // if yes, we split the string into an array to get individual ID's of each tags, and assign it 
    // to the tags property of the body
    if (req.body.tags && req.body.tags.length > 0) {
        req.body.tags = req.body.tags.split(',');
    }else {
        req.body.tags = []; // Set an empty array if no valid tags exist
    }

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

// Controller function to add / update / delete a rating for a Place by ID
exports.addUpdateOrDeleteRating = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { stars } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found.');
    }
    if (!id) {
        return res.status(400).send('Place not provided.');
    }
    const place = await Place.findById(id);
    if (!place) {
        return res.status(404).send('Place not found.');
    }

    if (stars < 0 || stars > 5) {
        return res.status(400).send('Invalid rating. Please provide a value between 1 and 5.');
    }

    try {
        const existingRating = place.ratings.find(rating => rating.userId.toString() === userId.toString());

        if (place.averageRating && place.ratings.length > 0) {
            let totalStars = place.averageRating * place.ratings.length;

            if (existingRating) {
                totalStars = totalStars - existingRating.stars + stars;

                if (stars === 0) {
                    place.ratings = place.ratings.filter(rating => rating.userId.toString() !== userId.toString());
                } else {
                    existingRating.stars = stars;
                }
                if (place.ratings.length > 0) {
                    place.averageRating = totalStars / place.ratings.length;
                }
                else
                    place.averageRating = 0;

            } else {
                if (stars !== 0) {
                    totalStars += stars;
                    place.ratings.push({ userId, stars });
                    place.averageRating = totalStars / place.ratings.length;
                }
            }

        } else {
            if (stars !== 0) {
                place.ratings.push({ userId, stars });
            }
            place.averageRating = stars;
        }

        await place.save();

        res.status(200).send({
            message: 'Rating updated successfully.',
            averageRating: place.averageRating
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});