const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    img: {
        type: String
    },
    youtube: {
        type: String
    },
    coordinates: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    ratings: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        stars: { type: Number, min: 1, max: 5 }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    isRelevant: {
        type: Boolean,
        default: true
    }
});

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;