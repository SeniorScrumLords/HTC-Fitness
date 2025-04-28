const mongoose = require('mongoose');
// reminder schema
const reminderSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user_id: String,

  
});

module.exports = reminderSchema;
