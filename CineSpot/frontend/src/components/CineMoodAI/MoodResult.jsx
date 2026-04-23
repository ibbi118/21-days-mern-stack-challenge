import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiRefreshCw } from 'react-icons/fi';
import './MoodResult.scss';

export default function MoodResult({ detectedMood, onReset, onFetchMovies }) {
  const cardRef = useRef(null);
  const emojiRef = useRef(null);

  useEffect(() => {
    if (!detectedMood || !cardRef.current) return;

    // Entrance animation
    gsap.fromTo(cardRef.current,
      { opacity: 0, scale: 0.85, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.65, ease: 'back.out(1.5)' }
    );

    // Emoji bounce
    gsap.fromTo(emojiRef.current,
      { scale: 0, rotation: -20 },
      { scale: 1, rotation: 0, duration: 0.55, delay: 0.25, ease: 'back.out(2)' }
    );

    // Auto-fetch after reveal
    const timer = setTimeout(() => onFetchMovies(detectedMood.mood), 800);
    return () => clearTimeout(timer);
  }, [detectedMood]);

  if (!detectedMood) return null;

  const { emoji, label, color, confidence, fallback } = detectedMood;

  return (
    <div className="mood-result" ref={cardRef} style={{ '--mood-clr': color }}>
      {/* Background glow */}
      <div className="mood-result__glow" />

      <div className="mood-result__emoji" ref={emojiRef}>{emoji}</div>

      <div className="mood-result__text">
        <h2 className="mood-result__label">{label}</h2>
        {!fallback && confidence > 0 && (
          <div className="mood-result__confidence">
            <div className="conf-bar">
              <div className="conf-fill" style={{ width: `${confidence}%` }} />
            </div>
            <span>{confidence}% confidence</span>
          </div>
        )}
        {fallback && (
          <p className="mood-result__fallback-note">
            Could not detect a face clearly — showing popular picks instead.
          </p>
        )}
      </div>

      <button className="mood-result__reset" onClick={onReset}>
        <FiRefreshCw /> Try Again
      </button>
    </div>
  );
}
