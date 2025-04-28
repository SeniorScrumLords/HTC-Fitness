const mongoose = require ('mongoose');

const settingsSchema = new mongoose.Schema({
  prefName: String,
  dashboard: [],
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

 module.exports = settingsSchema;