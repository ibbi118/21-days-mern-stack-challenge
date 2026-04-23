import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularTV } from '../features/movies/movieSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { FiTv } from 'react-icons/fi';
import './BrowsePage.scss';

export default function TVShows() {
  const dispatch = useDispatch();
  const { tv, loading } = useSelector(s => s.movies);
  const [allTV, setAllTV] = useState([]);
  const [page, setPage] = useState(1);
  const bottomRef = useRef(null);
  const loadingMore = useRef(false);

  useEffect(() => {
    dispatch(fetchPopularTV(1));
  }, [dispatch]);

  useEffect(() => {
    if (tv.length > 0) {
      setAllTV(prev => {
        const ids = new Set(prev.map(i => i.id));
        const newItems = tv.filter(i => !ids.has(i.id));
        return [...prev, ...newItems];
      });
    }
  }, [tv]);

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading && page < 15 && !loadingMore.current) {
      loadingMore.current = true;
      const next = page + 1;
      setPage(next);
      dispatch(fetchPopularTV(next)).finally(() => { loadingMore.current = false; });
    }
  }, [loading, page, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="browse-page page-wrapper">
      <div className="container">
        <div className="browse-page__header">
          <div className="browse-page__icon" style={{ background: 'rgba(76,201,240,0.15)', color: 'var(--accent-blue)' }}>
            <FiTv />
          </div>
          <div>
            <h1 className="section-title">Popular <span>TV Shows</span></h1>
            <p className="browse-page__sub">Binge-worthy series handpicked for you</p>
          </div>
        </div>

        {allTV.length === 0 && loading
          ? <SkeletonGrid count={20} />
          : (
            <div className="browse-page__grid">
              {allTV.map(item => (
                <MovieCard key={item.id} item={item} mediaType="tv" />
              ))}
            </div>
          )
        }

        <div ref={bottomRef} style={{ height: 40 }} />
        {loading && allTV.length > 0 && (
          <div className="browse-page__loading">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}
