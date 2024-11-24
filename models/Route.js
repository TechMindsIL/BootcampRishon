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
        required: true, 
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
    isRelevant: {
        type: Boolean,
        default: true
    }
});

let Route = mongoose.model('Route', routeSchema);

module.exports = Route;
