const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  time: {
    type: String,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  },
});

mongoose.model('ideas', IdeaSchema);