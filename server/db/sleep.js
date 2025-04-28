const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  quality: { type: Number, min: 0, max: 7 },
  goal: Number,
  hours_slept: String,
  sleep_aid: String,
  disturbances: Number,
  disturbance_notes: String,
  begin_sleep: Date,
  stop_sleep: Date,
  user_id: String,
});

module.exports = sleepSchema;
