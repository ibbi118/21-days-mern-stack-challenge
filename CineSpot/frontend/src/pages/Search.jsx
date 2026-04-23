import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchContent, clearSearch, setQuery } from '../features/search/searchSlice';
import { useDebounce } from '../hooks/useDebounce';
import MovieCard from '../components/MovieCard/MovieCard';
import { SkeletonGrid } from '../components/Loader/Loader';
import { FiSearch, FiX } from 'react-icons/fi';
import './Search.scss';

export default function Search() {
  const dispatch = useDispatch();
  const { results, loading, totalPages, page, query } = useSelector(s => s.search);
  const [input, setInput] = useState(query || '');
  const debouncedInput = useDebounce(input, 450);
  const bottomRef = useRef(null);
  const loadingMore = useRef(false);

  useEffect(() => {
    if (debouncedInput.trim().length < 2) {
      dispatch(clearSearch());
      return;
    }
    dispatch(searchContent({ query: debouncedInput, page: 1 }));
  }, [debouncedInput, dispatch]);

  // Infinite scroll observer
  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !loading && page < totalPages && !loadingMore.current) {
      loadingMore.current = true;
      dispatch(searchContent({ query: debouncedInput, page: page + 1 }))
        .finally(() => { loadingMore.current = false; });
    }
  }, [loading, page, totalPages, debouncedInput, dispatch]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleClear = () => {
    setInput('');
    dispatch(clearSearch());
  };

  const filtered = results.filter(item =>
    item.media_type !== 'person' || item.known_for_department
  );

  return (
    <div className="search-page page-wrapper">
      <div className="container">
        <div className="search-page__header">
          <h1 className="section-title">Search <span>CineSpot</span></h1>
          <p className="search-page__sub">Find movies, TV shows, and people</p>
        </div>

        <div className="search-page__bar">
          <div className="search-input-wrap">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search movies, TV shows, actors..."
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            {input && (
              <button className="clear-btn" onClick={handleClear}><FiX /></button>
            )}
          </div>
        </div>

        {!debouncedInput && (
          <div className="search-page__empty">
            <div className="empty-icon">🔍</div>
            <h3>Start typing to search</h3>
            <p>Discover thousands of movies, TV shows, and more</p>
          </div>
        )}

        {debouncedInput && loading && results.length === 0 && <SkeletonGrid count={12} />}

        {results.length > 0 && (
          <>
            <div className="search-page__count">
              {filtered.length} results for "<strong>{query}</strong>"
            </div>
            <div className="search-page__grid">
              {filtered.map(item => (
                <MovieCard key={`${item.id}-${item.media_type}`} item={item} />
              ))}
            </div>
          </>
        )}

        {debouncedInput && !loading && results.length === 0 && query && (
          <div className="search-page__empty">
            <div className="empty-icon">😕</div>
            <h3>No results found</h3>
            <p>Try a different search term</p>
          </div>
        )}

        <div ref={bottomRef} style={{ height: 40 }} />
        {loading && results.length > 0 && (
          <div className="search-page__loading-more">
            <div className="loading-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
