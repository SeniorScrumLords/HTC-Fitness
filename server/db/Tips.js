const mongoose = require('mongoose');

const TipsSchema = new mongoose.Schema({
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',  },
  tipsId: String,
  gender: String,
  intensity: Number,
  tips: [String],
  disabled: Boolean
});

module.exports = TipsSchema;
