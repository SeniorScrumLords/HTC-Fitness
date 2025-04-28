const mongoose = require('mongoose');
// New schemas
const sleepSchema = require('./sleep');
const RoutineSchema = require('./routineSchema');

const TipsSchema = require('./Tips');

const settingsSchema = require('./Settings');

const reminderSchema = require('./Reminder');

// Exercise schema
const exerciseSchema = new mongoose.Schema({
  name: String,
  type: String,
  muscle: String,
  equipment: String,
  difficulty: String,
  instructions: String,
});

const weightSchema = new mongoose.Schema({
  weight: Number,
  date: Date,
});

const SavedExerciseSchema = new mongoose.Schema({
  name: String,
  type: String,
  muscle: String,
  equipment: String,
  difficulty: String,
  instructions: String,
  sets: { type: Number, default: null },
  reps: { type: Number, default: null },
});

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true },
  nameFirst: String,
  nameLast: String,
  email: String,
  goal_weight: Number,
  weights: [weightSchema],
  saved_exercises: [SavedExerciseSchema],
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
const User = mongoose.model('User', userSchema);
const Sleep = mongoose.model('Sleep', sleepSchema);
const Settings = mongoose.model('Settings', settingsSchema)
const Tips = mongoose.model('Tip', TipsSchema);
const Reminder = mongoose.model('Reminder', reminderSchema);

const Routine = mongoose.model('Routine', RoutineSchema);

module.exports = { Exercise, User, Sleep, Routine, Tips, Settings, Reminder};


