const User = require('../models/User');
const Favorite = require('../models/Favorite');
const History = require('../models/History');

// Favorites
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, favorites });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, poster, rating, releaseDate } = req.body;
    const existing = await Favorite.findOne({ user: req.user._id, tmdbId });
    if (existing) return res.status(400).json({ success: false, message: 'Already in favorites' });
    const fav = await Favorite.create({ user: req.user._id, tmdbId, mediaType, title, poster, rating, releaseDate });
    res.status(201).json({ success: true, favorite: fav });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ user: req.user._id, tmdbId: req.params.tmdbId });
    res.json({ success: true, message: 'Removed from favorites' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// History
exports.getHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id }).sort({ watchedAt: -1 }).limit(50);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addHistory = async (req, res) => {
  try {
    const { tmdbId, mediaType, title, poster, rating } = req.body;
    await History.findOneAndUpdate(
      { user: req.user._id, tmdbId },
      { user: req.user._id, tmdbId, mediaType, title, poster, rating, watchedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'History updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: true }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.unbanUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBanned: false }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
