import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Search from '../pages/Search';
import Movies from '../pages/Movies';
import TVShows from '../pages/TVShows';
import MovieDetails from '../pages/MovieDetails';
import CineMood from '../pages/CineMood';
import Favorites from '../pages/Favorites';
import History from '../pages/History';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminDashboard from '../pages/AdminDashboard';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/tv" element={<TVShows />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/tv/:id" element={<MovieDetails />} />
      <Route path="/cinemood" element={<CineMood />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/history" element={<History />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      color: 'var(--text-secondary)',
      paddingTop: 'var(--nav-height)',
    }}>
      <div style={{ fontSize: '5rem' }}>🎬</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
        404
      </h1>
      <p>This scene doesn't exist.</p>
      <a href="/" style={{ marginTop: 8, color: 'var(--accent-gold)', fontWeight: 600 }}>← Back to CineSpot</a>
    </div>
  );
}
