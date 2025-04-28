const mongoose = require('mongoose');


const RoutineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: String, required: true },
  muscle: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});


module.exports = RoutineSchema;