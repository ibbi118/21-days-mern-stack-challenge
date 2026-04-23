import './Loader.scss';

export function Loader({ fullscreen = false }) {
  return (
    <div className={`loader${fullscreen ? ' loader--fullscreen' : ''}`}>
      <div className="loader__spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <span>🎬</span>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__poster skeleton-shimmer"></div>
      <div className="skeleton-card__info">
        <div className="skeleton-card__title skeleton-shimmer"></div>
        <div className="skeleton-card__meta skeleton-shimmer"></div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
