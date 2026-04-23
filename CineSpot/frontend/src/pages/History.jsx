import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchHistory, clearHistory } from '../features/history/historySlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { FiClock, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './ListPage.scss';

export default function History() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector(s => s.history);
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    dispatch(fetchHistory());
  }, [user, dispatch, navigate]);

  const handleClear = () => {
    dispatch(clearHistory());
    toast.success('History cleared');
  };

  const cards = items.map(h => ({
    id: h.tmdbId,
    tmdbId: h.tmdbId,
    title: h.title,
    poster: h.poster,
    vote_average: h.rating,
    media_type: h.mediaType,
  }));

  return (
    <div className="list-page page-wrapper">
      <div className="container">
        <div className="list-page__header">
          <div className="list-page__icon" style={{ background: 'rgba(76,201,240,0.15)', color: 'var(--accent-blue)' }}>
            <FiClock />
          </div>
          <div style={{ flex: 1 }}>
            <h1 className="section-title">Watch <span>History</span></h1>
            <p className="list-page__count">{items.length} recently watched</p>
          </div>
          {items.length > 0 && (
            <button className="clear-history-btn" onClick={handleClear}>
              <FiTrash2 /> Clear All
            </button>
          )}
        </div>

        {loading && <SkeletonGrid count={12} />}

        {!loading && cards.length === 0 && (
          <div className="list-page__empty">
            <div className="empty-icon">🕐</div>
            <h3>No watch history</h3>
            <p>Movies you view will appear here automatically</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Start Watching</button>
          </div>
        )}

        {cards.length > 0 && (
          <div className="list-page__grid">
            {cards.map(item => (
              <MovieCard key={item.tmdbId} item={item} mediaType={item.media_type} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
