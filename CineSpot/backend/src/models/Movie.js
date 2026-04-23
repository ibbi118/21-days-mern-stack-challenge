const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  poster: { type: String, default: '' },
  description: { type: String, default: 'Description not available' },
  movieId: { type: String, unique: true },
  releaseDate: { type: String },
  trailerLink: { type: String, default: '' },
  genre: [{ type: String }],
  category: { type: String, enum: ['movie', 'tv', 'trending', 'popular'], default: 'movie' },
  rating: { type: Number, default: 0 },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
