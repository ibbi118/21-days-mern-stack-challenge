const express = require('express');
const router = express.Router();
const {
  getFavorites, addFavorite, removeFavorite,
  getHistory, addHistory, clearHistory,
  getAllUsers, banUser, unbanUser, deleteUser
} = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

// Favorites
router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:tmdbId', protect, removeFavorite);

// History
router.get('/history', protect, getHistory);
router.post('/history', protect, addHistory);
router.delete('/history', protect, clearHistory);

// Admin
router.get('/admin/users', protect, adminOnly, getAllUsers);
router.put('/admin/users/:id/ban', protect, adminOnly, banUser);
router.put('/admin/users/:id/unban', protect, adminOnly, unbanUser);
router.delete('/admin/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
