import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { gsap } from 'gsap';
import { fetchMovieDetails, clearDetails } from '../features/movies/movieSlice';
import { addFavorite, removeFavorite } from '../features/favorites/favoritesSlice';
import { addToHistory } from '../features/history/historySlice';
import TrailerModal from '../components/TrailerModal/TrailerModal';
import { IMG } from '../services/tmdbAPI';
import { Loader } from '../components/Loader/Loader';
import MovieRow from '../components/MovieRow/MovieRow';
import tmdbAPI from '../services/tmdbAPI';
import {
  FiPlay, FiHeart, FiStar, FiClock, FiCalendar,
  FiGlobe, FiArrowLeft, FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import './MovieDetails.scss';

export default function MovieDetails() {
  const { type = 'movie', id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { details, detailsLoading } = useSelector(s => s.movies);
  const { user } = useSelector(s => s.auth);
  const { items: favorites } = useSelector(s => s.favorites);
  const [showTrailer, setShowTrailer] = useState(false);
  const [similar, setSimilar] = useState([]);

  const isFav = favorites.some(f => f.tmdbId === String(id));

  useEffect(() => {
    dispatch(fetchMovieDetails({ id, type }));
    tmdbAPI.getSimilar(id, type).then(r => setSimilar(r.data.results?.slice(0, 12) || [])).catch(() => {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => dispatch(clearDetails());
  }, [id, type, dispatch]);

  useEffect(() => {
    if (!details) return;
    gsap.fromTo('.details__hero-content', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo('.details__body', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.3, ease: 'power3.out' });

    // Track history
    if (user) {
      dispatch(addToHistory({
        tmdbId: String(details.id),
        mediaType: type,
        title: details.title || details.name,
        poster: details.poster_path ? IMG(details.poster_path) : '',
        rating: details.vote_average,
      }));
    }
  }, [details]);

  const handleFav = () => {
    if (!user) { toast.error('Please login first'); return; }
    if (isFav) {
      dispatch(removeFavorite(String(id)));
      toast.success('Removed from favorites');
    } else {
      dispatch(addFavorite({
        tmdbId: String(id),
        mediaType: type,
        title: details?.title || details?.name,
        poster: details?.poster_path ? IMG(details.poster_path) : '',
        rating: details?.vote_average,
        releaseDate: details?.release_date || details?.first_air_date || '',
      }));
      toast.success('Added to favorites ❤️');
    }
  };

  const handleWatchTrailer = () => {
    setShowTrailer(true);
    if (user && details) {
      dispatch(addToHistory({
        tmdbId: String(details.id),
        mediaType: type,
        title: details.title || details.name,
        poster: details.poster_path ? IMG(details.poster_path) : '',
        rating: details.vote_average,
      }));
    }
  };

  if (detailsLoading) return <Loader fullscreen />;
  if (!details) return null;

  const trailerKey = details.videos?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key
    || details.videos?.find(v => v.site === 'YouTube')?.key;

  const title = details.title || details.name;
  const backdrop = details.backdrop_path ? IMG(details.backdrop_path, 'original') : null;
  const poster = details.poster_path ? IMG(details.poster_path, 'w500') : null;
  const year = (details.release_date || details.first_air_date || '').slice(0, 4);
  const runtime = details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : null;
  const cast = details.credits?.cast?.slice(0, 8) || [];

  return (
    <div className="details page-wrapper">
      {/* Backdrop */}
      <div className="details__backdrop">
        {backdrop && <img src={backdrop} alt={title} />}
        <div className="details__backdrop-overlay" />
      </div>

      <div className="details__hero-content container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </button>

        <div className="details__layout">
          {/* Poster */}
          <div className="details__poster">
            {poster
              ? <img src={poster} alt={title} />
              : <div className="details__poster-placeholder">🎬</div>
            }
          </div>

          {/* Info */}
          <div className="details__info">
            <div className="details__genres">
              {details.genres?.map(g => (
                <span key={g.id} className="genre-chip">{g.name}</span>
              ))}
            </div>

            <h1 className="details__title">{title}</h1>

            <div className="details__meta">
              {details.vote_average > 0 && (
                <div className="meta-item rating">
                  <FiStar /> {details.vote_average.toFixed(1)}
                  <span className="vote-count">({details.vote_count?.toLocaleString()})</span>
                </div>
              )}
              {year && <div className="meta-item"><FiCalendar /> {year}</div>}
              {runtime && <div className="meta-item"><FiClock /> {runtime}</div>}
              {details.original_language && (
                <div className="meta-item"><FiGlobe /> {details.original_language.toUpperCase()}</div>
              )}
            </div>

            <p className="details__overview">{details.overview || 'Description not available.'}</p>

            <div className="details__actions">
              <button className="btn-primary" onClick={handleWatchTrailer}>
                <FiPlay /> Watch Trailer
              </button>
              <button
                className={`btn-fav-toggle${isFav ? ' active' : ''}`}
                onClick={handleFav}
              >
                {isFav ? <><FiCheck /> In Favorites</> : <><FiHeart /> Add to Favorites</>}
              </button>
            </div>

            {details.tagline && (
              <p className="details__tagline">"{details.tagline}"</p>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="details__body container">
        {cast.length > 0 && (
          <section className="details__cast">
            <h2 className="section-title">Top <span>Cast</span></h2>
            <div className="cast-grid">
              {cast.map(person => (
                <div key={person.id} className="cast-card" onClick={() => navigate(`/person/${person.id}`)}>
                  <div className="cast-card__img">
                    {person.profile_path
                      ? <img src={IMG(person.profile_path, 'w185')} alt={person.name} loading="lazy" />
                      : <span>👤</span>
                    }
                  </div>
                  <div className="cast-card__name">{person.name}</div>
                  <div className="cast-card__char">{person.character}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {similar.length > 0 && (
          <MovieRow title="Similar" accent="🎯" items={similar} mediaType={type} />
        )}
      </div>

      {showTrailer && (
        <TrailerModal
          trailerKey={trailerKey}
          title={title}
          onClose={() => setShowTrailer(false)}
        />
      )}
    </div>
  );
}
