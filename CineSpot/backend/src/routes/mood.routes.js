const express = require('express');
const router = express.Router();
const axios = require('axios');

// Mood → TMDB genre IDs mapping
const MOOD_GENRES = {
  happy:   [35, 10749, 16, 10751],   // Comedy, Romance, Animation, Family
  sad:     [18, 10749, 36],           // Drama, Romance, History
  angry:   [28, 12, 53, 27],          // Action, Adventure, Thriller, Horror
  neutral: [878, 9648, 80, 37],       // Sci-Fi, Mystery, Crime, Western
  fearful: [27, 53, 9648],            // Horror, Thriller, Mystery
  surprised:[12, 14, 878, 28],        // Adventure, Fantasy, Sci-Fi, Action
  disgusted:[35, 16, 10751],          // Comedy, Animation, Family
};

const MOOD_LABELS = {
  happy: 'You\'re Feeling Happy 😊',
  sad: 'You\'re in Your Feelings 😢',
  angry: 'Feeling Intense 😡',
  neutral: 'Keeping It Cool 😐',
  fearful: 'Feeling Bold & Brave 😱',
  surprised: 'Full of Wonder 😲',
  disgusted: 'Feeling Selective 😤',
};

router.get('/recommendations', async (req, res) => {
  try {
    const mood = (req.query.mood || 'neutral').toLowerCase();
    const genres = MOOD_GENRES[mood] || MOOD_GENRES.neutral;
    const page = Math.floor(Math.random() * 5) + 1; // Random page for variety

    const tmdbKey = process.env.TMDB_API_KEY;

    // If TMDB key is configured on backend, fetch from there
    if (tmdbKey) {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: tmdbKey,
          with_genres: genres.join(','),
          sort_by: 'popularity.desc',
          language: 'en-US',
          page,
          'vote_count.gte': 100,
        },
      });
      return res.json({
        success: true,
        mood,
        label: MOOD_LABELS[mood] || `Mood: ${mood}`,
        genres,
        movies: response.data.results || [],
      });
    }

    // Without TMDB key on backend, return genre IDs for frontend to use
    res.json({
      success: true,
      mood,
      label: MOOD_LABELS[mood] || `Mood: ${mood}`,
      genres,
      movies: [], // Frontend will fetch using its own TMDB key
    });
  } catch (err) {
    console.error('Mood recommendations error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch recommendations' });
  }
});

module.exports = router;
