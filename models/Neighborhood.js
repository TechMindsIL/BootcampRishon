const mongoose = require('mongoose');

const neighborhoodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    caloriesBurned: {
        type: Number,
        required: true
    }
});

const Neighborhood = mongoose.model('Neighborhood', neighborhoodSchema);

module.exports = Neighborhood;