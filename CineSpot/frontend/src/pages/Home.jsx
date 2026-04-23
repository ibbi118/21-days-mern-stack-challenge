import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  fetchTrending, fetchPopularMovies, fetchPopularTV
} from '../features/movies/movieSlice';
import { IMG } from '../services/tmdbAPI';
import MovieRow from '../components/MovieRow/MovieRow';
import { FiPlay, FiInfo, FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import '../styles/home.scss';
import '../styles/globals.scss';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trending, popular, tv, loading } = useSelector(s => s.movies);
  const [heroIdx, setHeroIdx] = useState(0);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const autoRef = useRef(null);

  useEffect(() => {
    dispatch(fetchTrending());
    dispatch(fetchPopularMovies(1));
    dispatch(fetchPopularTV(1));
  }, [dispatch]);

  // GSAP hero entrance
  useEffect(() => {
    if (!trending.length) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.home__hero-badge', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
      gsap.fromTo('.home__hero-title', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.35, ease: 'power3.out' });
      gsap.fromTo('.home__hero-meta', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.5, ease: 'power3.out' });
      gsap.fromTo('.home__hero-overview', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.6, ease: 'power3.out' });
      gsap.fromTo('.home__hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.75, ease: 'power3.out' });

      // Scroll trigger for content sections
      gsap.fromTo('.movie-row', {
        opacity: 0, y: 60
      }, {
        opacity: 1, y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 85%',
        }
      });
    }, heroRef.current);
    return () => ctx.revert();
  }, [trending.length]);

  // Auto-advance hero
  useEffect(() => {
    if (trending.length < 2) return;
    autoRef.current = setInterval(() => {
      setHeroIdx(p => (p + 1) % Math.min(trending.length, 8));
    }, 6000);
    return () => clearInterval(autoRef.current);
  }, [trending.length]);

  const heroItem = trending[heroIdx];
  const heroType = heroItem?.media_type || 'movie';
  const heroTitle = heroItem?.title || heroItem?.name || '';
  const heroBg = heroItem?.backdrop_path ? IMG(heroItem.backdrop_path, 'original') : null;
  const heroRating = heroItem?.vote_average?.toFixed(1);
  const heroYear = (heroItem?.release_date || heroItem?.first_air_date || '').slice(0, 4);
  const heroOverview = heroItem?.overview || '';

  const nextHero = () => {
    clearInterval(autoRef.current);
    setHeroIdx(p => (p + 1) % Math.min(trending.length, 8));
  };
  const prevHero = () => {
    clearInterval(autoRef.current);
    setHeroIdx(p => (p - 1 + Math.min(trending.length, 8)) % Math.min(trending.length, 8));
  };

  return (
    <div className="home page-wrapper" ref={heroRef}>
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-bg">
          {heroBg && <img src={heroBg} alt={heroTitle} key={heroIdx} />}
        </div>

        <div className="home__hero-content">
          <div className="home__hero-badge">
            <span>🔥</span> Trending Now
          </div>
          <h1 className="home__hero-title">{heroTitle}</h1>
          <div className="home__hero-meta">
            {heroRating && (
              <div className="rating"><FiStar /> {heroRating}</div>
            )}
            {heroYear && <span className="year">{heroYear}</span>}
            <span className="genre-tag">{heroType === 'tv' ? 'TV Series' : 'Movie'}</span>
          </div>
          <p className="home__hero-overview">{heroOverview || 'An unforgettable cinematic experience.'}</p>
          <div className="home__hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate(`/${heroType}/${heroItem?.id}`)}
            >
              <FiPlay /> Watch Now
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate(`/${heroType}/${heroItem?.id}`)}
            >
              <FiInfo /> More Info
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate('/cinemood')}
              style={{ borderColor: 'rgba(245,197,24,0.3)', color: 'var(--accent-gold)' }}
            >
              <HiSparkles /> CineMood AI
            </button>
          </div>
        </div>

        {/* Hero dots */}
        <div className="home__hero-dots">
          {trending.slice(0, 8).map((_, i) => (
            <button key={i} className={`dot${i === heroIdx ? ' active' : ''}`} onClick={() => { clearInterval(autoRef.current); setHeroIdx(i); }} />
          ))}
        </div>

        {/* Hero prev/next */}
        <div className="home__hero-nav">
          <button className="btn-icon" onClick={prevHero}><FiChevronLeft /></button>
          <button className="btn-icon" onClick={nextHero}><FiChevronRight /></button>
        </div>
      </section>

      {/* Content */}
      <div className="home__content" ref={contentRef}>
        <div className="container">
          <MovieRow
            title="Trending"
            accent="🔥"
            items={trending}
            loading={loading}
            viewAllLink="/movies"
          />
          <MovieRow
            title="Popular Movies"
            accent="🎬"
            items={popular}
            loading={loading}
            mediaType="movie"
            viewAllLink="/movies"
          />
          <MovieRow
            title="Top TV Shows"
            accent="📺"
            items={tv}
            loading={loading}
            mediaType="tv"
            viewAllLink="/tv"
          />
        </div>
      </div>
    </div>
  );
}
