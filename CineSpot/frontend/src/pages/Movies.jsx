import { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularMovies } from '../features/movies/movieSlice';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { FiFilm } from 'react-icons/fi';
import './BrowsePage.scss';

export default function Movies() {
  const dispatch = useDispatch();
  const { popular, popularPage, loading } = useSelector(s => s.movies);
  const bottomRef = useRef(null);
  const loadingMore = useRef(false);
  const [maxPage] = useState(20);

  useEffect(() => {
    if (popular.length === 0) dispatch(fetchPopularMovies(1));
  }, [dispatch]);

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading && popularPage < maxPage && !loadingMore.current) {
      loadingMore.current = true;
      dispatch(fetchPopularMovies(popularPage + 1)).finally(() => { loadingMore.current = false; });
    }
  }, [loading, popularPage, dispatch, maxPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="browse-page page-wrapper">
      <div className="container">
        <div className="browse-page__header">
          <div className="browse-page__icon"><FiFilm /></div>
          <div>
            <h1 className="section-title">Popular <span>Movies</span></h1>
            <p className="browse-page__sub">Scroll down to discover more</p>
          </div>
        </div>

        {popular.length === 0 && loading
          ? <SkeletonGrid count={20} />
          : (
            <div className="browse-page__grid">
              {popular.map(item => (
                <MovieCard key={item.id} item={item} mediaType="movie" />
              ))}
            </div>
          )
        }

        <div ref={bottomRef} style={{ height: 40 }} />
        {loading && popular.length > 0 && (
          <div className="browse-page__loading">
            <div className="loading-dots"><span /><span /><span /></div>
          </div>
        )}
      </div>
    </div>
  );
}
