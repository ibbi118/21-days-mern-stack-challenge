const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  title: { type: String },
  poster: { type: String },
  rating: { type: Number },
  watchedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
