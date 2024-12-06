const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isRelevant: {
    type: Boolean,
    default: true
  }
});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;