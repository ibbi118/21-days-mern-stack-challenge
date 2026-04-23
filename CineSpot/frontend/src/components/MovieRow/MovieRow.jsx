import { useRef } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';
import { SkeletonCard } from '../Loader/Loader';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './MovieRow.scss';

export default function MovieRow({ title, accent, items = [], loading, viewAllLink, mediaType }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 280, behavior: 'smooth' });
    }
  };

  return (
    <section className="movie-row">
      <div className="movie-row__header">
        <h2 className="movie-row__title">
          {accent ? <><span>{accent}</span> {title}</> : title}
        </h2>
        <div className="movie-row__controls">
          <button className="row-btn" onClick={() => scroll(-1)}><FiChevronLeft /></button>
          <button className="row-btn" onClick={() => scroll(1)}><FiChevronRight /></button>
          {viewAllLink && <Link to={viewAllLink} className="view-all">View All</Link>}
        </div>
      </div>

      <div className="movie-row__track" ref={rowRef}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => (
              <MovieCard key={item.id || item._id || item.tmdbId} item={item} mediaType={mediaType} />
            ))
        }
      </div>
    </section>
  );
}
