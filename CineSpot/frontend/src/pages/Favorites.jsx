import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchFavorites } from '../features/favorites/favoritesSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { FiHeart } from 'react-icons/fi';
import './ListPage.scss';

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(s => s.favorites);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchFavorites());
  }, [user, dispatch, navigate]);

  // Convert favorites format to match MovieCard expectations
  const cards = items.map(f => ({
    id: f.tmdbId,
    tmdbId: f.tmdbId,
    title: f.title,
    name: f.title,
    poster: f.poster,
    vote_average: f.rating,
    release_date: f.releaseDate,
    media_type: f.mediaType,
  }));

  return (
    <div className="list-page page-wrapper">
      <div className="container">
        <div className="list-page__header">
          <div className="list-page__icon" style={{ background: 'rgba(230,57,70,0.15)', color: 'var(--accent-red)' }}>
            <FiHeart />
          </div>
          <div>
            <h1 className="section-title">My <span>Favorites</span></h1>
            <p className="list-page__count">
              {items.length} {items.length === 1 ? 'movie' : 'movies'} saved
            </p>
          </div>
        </div>

        {loading && <SkeletonGrid count={12} />}

        {!loading && cards.length === 0 && (
          <div className="list-page__empty">
            <div className="empty-icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Start adding movies you love to see them here</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Browse Movies</button>
          </div>
        )}

        {cards.length > 0 && (
          <div className="list-page__grid">
            {cards.map(item => (
              <MovieCard
                key={item.tmdbId}
                item={item}
                mediaType={item.media_type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
