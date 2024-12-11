const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    caloriesBurned: {
        type: Number,
        required: true
    },
    activitiesFinished: {
        type: Number,
        default: 0
    }
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

module.exports = Neighborhood;