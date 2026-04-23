import { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import {
  FiSearch, FiHeart, FiClock, FiSettings, FiLogOut,
  FiMenu, FiX, FiHome, FiFilm, FiTv, FiStar, FiUser
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import toast from 'react-hot-toast';
import './Navbar.scss';

const navLinks = [
  { to: '/', label: 'Home', icon: <FiHome /> },
  { to: '/movies', label: 'Movies', icon: <FiFilm /> },
  { to: '/tv', label: 'TV Shows', icon: <FiTv /> },
  { to: '/cinemood', label: 'CineMood AI', icon: <HiSparkles />, isMood: true },
  { to: '/favorites', label: 'Favorites', icon: <FiHeart /> },
  { to: '/history', label: 'History', icon: <FiClock /> },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <div className="logo-icon">🎬</div>
            <div className="logo-text">Cine<span>Spot</span></div>
          </Link>

          <ul className="navbar__links">
            {navLinks.map(link => (
              <li key={link.to} className={`navbar__link${link.isMood ? ' navbar__link--cinemood' : ''}`}>
                <NavLink to={link.to} className={({ isActive }) => isActive ? 'active' : ''}>
                  {link.icon}
                  {link.label}
                  {link.isMood && <span className="badge-new">NEW</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <button className="navbar__search-btn" onClick={() => navigate('/search')} aria-label="Search">
              <FiSearch />
            </button>

            {user ? (
              <div className="navbar__user" ref={dropRef}>
                <div className="user-avatar" onClick={() => setDropdownOpen(p => !p)}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                {dropdownOpen && (
                  <div className="user-dropdown">
                    <div style={{ padding: '8px 12px 4px', fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {user.name}
                    </div>
                    <hr />
                    <Link to="/favorites" onClick={() => setDropdownOpen(false)}><FiHeart /> Favorites</Link>
                    <Link to="/history" onClick={() => setDropdownOpen(false)}><FiClock /> History</Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}><FiSettings /> Admin Panel</Link>
                    )}
                    <hr />
                    <button onClick={handleLogout} className="danger"><FiLogOut /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar__auth-btns">
                <button className="btn-login" onClick={() => navigate('/login')}>Log In</button>
                <button className="btn-signup" onClick={() => navigate('/signup')}>Sign Up</button>
              </div>
            )}

            <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(true)}>
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="mobile-menu">
          <button className="mobile-menu__close" onClick={() => setMobileOpen(false)}><FiX /></button>
          <ul className="mobile-menu__links">
            {navLinks.map(link => (
              <li key={link.to} className={link.isMood ? 'cinemood-link' : ''}>
                <NavLink to={link.to} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'active' : ''}>
                  {link.icon}
                  {link.label}
                  {link.isMood && <span className="badge-new" style={{ marginLeft: 8 }}>NEW</span>}
                </NavLink>
              </li>
            ))}
            {!user && (
              <>
                <li><Link to="/login" onClick={() => setMobileOpen(false)}><FiUser /> Log In</Link></li>
                <li><Link to="/signup" onClick={() => setMobileOpen(false)}><FiUser /> Sign Up</Link></li>
              </>
            )}
            {user && (
              <li>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: '16px', display: 'flex', alignItems: 'center', gap: 12, color: 'var(--accent-red)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '1.1rem', width: '100%', borderRadius: 'var(--radius-md)' }}>
                  <FiLogOut /> Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
}
