import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../features/favorites/favoritesSlice';
import { FiHeart, FiPlay, FiStar, FiFilm } from 'react-icons/fi';
import { IMG } from '../../services/tmdbAPI';
import toast from 'react-hot-toast';
import './MovieCard.scss';

export default function MovieCard({ item, size = 'md', mediaType }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items: favorites } = useSelector(s => s.favorites);
  const [imgErr, setImgErr] = useState(false);

  const id = item?.id || item?.tmdbId;
  const type = mediaType || item?.media_type || (item?.title ? 'movie' : 'tv');
  const title = item?.title || item?.name || 'Unknown Title';
  const poster = item?.poster_path ? IMG(item.poster_path) : item?.poster || null;
  const rating = item?.vote_average || item?.rating || 0;
  const year = (item?.release_date || item?.first_air_date || '')?.slice(0, 4);
  const isFav = favorites.some(f => f.tmdbId === String(id));

  const handleDetails = (e) => {
    e.stopPropagation();
    navigate(`/${type}/${id}`);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    if (!user) { toast.error('Please login to add favorites'); return; }
    if (isFav) {
      dispatch(removeFavorite(String(id)));
      toast.success('Removed from favorites');
    } else {
      dispatch(addFavorite({
        tmdbId: String(id),
        mediaType: type,
        title,
        poster: item?.poster_path ? IMG(item.poster_path) : '',
        rating: rating,
        releaseDate: item?.release_date || item?.first_air_date || '',
      }));
      toast.success('Added to favorites ❤️');
    }
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/${type}/${id}`);
  };

  return (
    <div className={`movie-card movie-card--${size}`} onClick={handleDetails}>
      <div className="movie-card__poster">
        {poster && !imgErr ? (
          <img src={poster} alt={title} loading="lazy" onError={() => setImgErr(true)} />
        ) : (
          <div className="placeholder-poster">
            <FiFilm />
            <span>No Poster</span>
          </div>
        )}

        <div className="movie-card__overlay">
          <div className="movie-card__play" onClick={handlePlay}><FiPlay /></div>
          <div className="movie-card__overlay-actions">
            <button className="btn-details" onClick={handleDetails}>Details</button>
            <button className={`btn-fav${isFav ? ' active' : ''}`} onClick={handleFav}>
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      <div className="movie-card__info">
        <div className="movie-card__title">{title}</div>
        <div className="movie-card__meta">
          {rating > 0 && (
            <div className="movie-card__rating">
              <FiStar /> {rating.toFixed(1)}
            </div>
          )}
          {year && <div className="movie-card__year">{year}</div>}
          <div className="movie-card__type">{type === 'tv' ? 'TV' : 'Film'}</div>
        </div>
      </div>
    </div>
  );
}
