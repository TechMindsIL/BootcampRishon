const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    distance: {
        type: Number,
        default: ""
    },
    duration: {
        type: Number,
        default: ""
    },
    level: {
        type: String,
        enum: ['מתחיל', 'בינוני', 'מתקדם'],
    },
    places: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Place',
        default: []
    },
    tags: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Tag',
        default: []
    },
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

let Route = mongoose.model('Route', routeSchema);

module.exports = Route;
