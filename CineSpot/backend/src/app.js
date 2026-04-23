const express = require('express');
const cors = require('cors');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/movies', require('./routes/movie.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/mood', require('./routes/mood.routes'));

app.get('/', (req, res) => res.json({ message: '🎬 CineSpot API Running' }));

// Error handler
app.use(errorMiddleware);

module.exports = app;
