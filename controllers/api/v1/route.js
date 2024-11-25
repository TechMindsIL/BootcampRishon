const User = require('../../../models/User');
const Route = require('../../../models/Route'); // Import the Route model
const asyncHandler = require('../../../utils/asyncHandler'); // Adjust the path as needed

// Controller function to get all Routes
exports.getAllRoutes = asyncHandler(async (req, res) => {
    // Fetch all Routes from the database
    const routes = await Route.find()
        .sort({ _id: -1 })
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .populate({
            path: 'places',
            populate: [
                {
                    path: 'tags',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                }
            ]
        });

    res.json(routes);
});

// Controller function to get a query of Routes
exports.getRouteByQuery = asyncHandler(async (req, res) => {
    const { distanceRange, durationRange, name, tags, isRelevant, places } = req.query;

    // Build the query object
    let query = {};

    // Min-Max Range Filters
    if (distanceRange) {
        const minDistance = distanceRange.min;
        const maxDistance = distanceRange.max;
        if (minDistance || maxDistance) {
            query.distance = {};
            if (minDistance) query.distance.$gte = Number(minDistance);
            if (maxDistance) query.distance.$lte = Number(maxDistance);
        }
    }

    if (durationRange) {
        const minDuration = durationRange.min;
        const maxDuration = durationRange.max;
        if (minDuration || maxDuration) {
            query.duration = {};
            if (minDuration) query.duration.$gte = Number(minDuration);
            if (maxDuration) query.duration.$lte = Number(maxDuration);
        }
    }

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

    // Places Array Matching
    if (places) {
        query.places = { $all: places.split(',') }; // Assuming places are provided as a comma-separated string
    }

    // Fetch all Routes from the database that match the query
    const routes = await Route.find(query)
        .sort({ _id: -1 })
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .populate({
            path: 'places',
            populate: [
                {
                    path: 'tags',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                }
            ]
        });

    res.json(routes);
});

// Controller function to create a new Route
exports.createRoute = asyncHandler(async (req, res) => {
    console.log(req.body);
    // Create a new Route instance
    const route = new Route(req.body);

    // Save the Route instance to the database
    await route.save();

    res.json(route);
});

// Controller function to get a Route by ID
exports.getRouteById = asyncHandler(async (req, res) => {
    // Fetch the Route by ID from the database
    const route = await Route.findById(req.params.id)
        .populate({
            path: 'tags',
            populate: {
                path: 'category',
                model: 'Category'
            }
        })
        .populate({
            path: 'places',
            populate: [
                {
                    path: 'tags',
                    populate: {
                        path: 'category',
                        model: 'Category'
                    }
                }
            ]
        });

    res.json(route);
});

// Controller function to update a Route by ID
exports.updateRoute = asyncHandler(async (req, res) => {
    // Update the Route by ID with the new data from the request body
    const updatedRoute = await Route.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(updatedRoute);
});

// Controller function to delete a Route by ID
exports.deleteRoute = asyncHandler(async (req, res) => {
    // Delete the Route by ID
    await Route.findByIdAndDelete(req.params.id);

    res.json({ message: 'Route deleted successfully' });
});

// Controller function to add / update / delete a rating for a Route by ID
exports.addUpdateOrDeleteRating = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;
    const { stars } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).send('User not found.');
    }
    if (!id) {
        return res.status(400).send('Route not provided.');
    }
    const route = await Route.findById(id);
    if (!route) {
        return res.status(404).send('Route not found.');
    }

    if (stars < 0 || stars > 5) {
        return res.status(400).send('Invalid rating. Please provide a value between 1 and 5.');
    }

    try {
        const existingRating = route.ratings.find(rating => rating.userId.toString() === userId.toString());

        if (route.averageRating && route.ratings.length > 0) {
            let totalStars = route.averageRating * route.ratings.length;

            if (existingRating) {
                totalStars = totalStars - existingRating.stars + stars;

                if (stars === 0) {
                    route.ratings = route.ratings.filter(rating => rating.userId.toString() !== userId.toString());
                } else {
                    existingRating.stars = stars;
                }
                if (route.ratings.length > 0) {
                    route.averageRating = totalStars / route.ratings.length;
                }
                else
                    route.averageRating = 0;

            } else {
                if (stars !== 0) {
                    totalStars += stars;
                    route.ratings.push({ userId, stars });
                    route.averageRating = totalStars / route.ratings.length;
                }
            }

        } else {
            if (stars !== 0) {
                route.ratings.push({ userId, stars });
            }
            route.averageRating = stars;
        }

        await route.save();

        res.status(200).send({
            message: 'Rating updated successfully.',
            averageRating: route.averageRating
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error.');
    }
});