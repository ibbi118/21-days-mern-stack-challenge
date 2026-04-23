import { Link } from 'react-router-dom';
import {
  FiGithub, FiLinkedin, FiTwitter,
  FiHeart, FiFilm, FiTv, FiClock, FiTrendingUp, FiStar, FiBarChart2
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import './Footer.scss';

const NAV_LINKS = [
  { to: '/',          label: 'Home',        icon: <FiFilm /> },
  { to: '/movies',    label: 'Movies',      icon: <FiFilm /> },
  { to: '/tv',        label: 'TV Shows',    icon: <FiTv /> },
  { to: '/favorites', label: 'Favorites',   icon: <FiHeart /> },
  { to: '/history',   label: 'History',     icon: <FiClock /> },
  { to: '/cinemood',  label: 'CineMood AI', icon: <HiSparkles />, badge: true },
];

const FEATURE_LINKS = [
  { to: '/',       label: 'Trending Now',  icon: <FiTrendingUp /> },
  { to: '/movies', label: 'Popular Movies',icon: <FiBarChart2 /> },
  { to: '/movies', label: 'Top Rated',     icon: <FiStar /> },
  { to: '/tv',     label: 'Popular TV',    icon: <FiTv /> },
];

const SOCIAL_LINKS = [
  { href: 'https://github.com',   icon: <FiGithub />,   label: 'GitHub'   },
  { href: 'https://linkedin.com', icon: <FiLinkedin />, label: 'LinkedIn' },
  { href: 'https://twitter.com',  icon: <FiTwitter />,  label: 'Twitter'  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner container">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <div className="footer__logo-icon">🎬</div>
            <div className="footer__logo-text">Cine<span>Spot</span></div>
          </Link>
          <p className="footer__tagline">
            Discover Movies That Match Your Vibe
          </p>
          <div className="footer__social">
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="footer__social-btn"
                aria-label={s.label}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Navigation</h4>
          <ul className="footer__links">
            {NAV_LINKS.map(link => (
              <li key={link.to + link.label}>
                <Link to={link.to} className={link.badge ? 'footer__link footer__link--mood' : 'footer__link'}>
                  {link.icon}
                  {link.label}
                  {link.badge && <span className="badge-new">NEW</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Features ── */}
        <div className="footer__col">
          <h4 className="footer__col-title">Features</h4>
          <ul className="footer__links">
            {FEATURE_LINKS.map(link => (
              <li key={link.label}>
                <Link to={link.to} className="footer__link">
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} CineSpot. All rights reserved.
          </p>
          <p className="footer__made">
            Made with <FiHeart className="footer__heart" /> for cinema lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
