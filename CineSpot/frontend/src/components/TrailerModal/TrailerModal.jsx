import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import './TrailerModal.scss';

export default function TrailerModal({ trailerKey, title, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="trailer-modal">
      <div className="trailer-modal__backdrop" onClick={onClose} />
      <div className="trailer-modal__content">
        <div className="trailer-modal__header">
          <h3>{title || 'Trailer'}</h3>
          <button className="trailer-modal__close" onClick={onClose}><FiX /></button>
        </div>

        {trailerKey ? (
          <div className="trailer-modal__frame">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="trailer-modal__unavailable">
            <div className="icon">🎬</div>
            <h3>No Trailer Available</h3>
            <p>Trailer for this movie is currently unavailable.</p>
          </div>
        )}
      </div>
    </div>
  );
}
