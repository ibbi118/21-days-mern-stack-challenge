const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tmdbId: { type: String, required: true },
  mediaType: { type: String, enum: ['movie', 'tv'], default: 'movie' },
  title: { type: String },
  poster: { type: String },
  rating: { type: Number },
  releaseDate: { type: String },
}, { timestamps: true });

favoriteSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
