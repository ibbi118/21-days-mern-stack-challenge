import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice';
import { gsap } from 'gsap';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Auth.scss';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (user) navigate('/');
    gsap.fromTo(cardRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
    return () => dispatch(clearError());
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    const result = await dispatch(register(form));
    if (!result.error) {
      toast.success('Account created! Welcome to CineSpot 🎬');
      navigate('/');
    }
  };

  return (
    <div className="auth-page page-wrapper">
      <div className="auth-page__bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-card" ref={cardRef}>
        <div className="auth-card__brand"><span>🎬</span> CineSpot</div>
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__sub">Join CineSpot and start your cinematic journey</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Full Name</label>
            <div className="input-wrap">
              <FiUser />
              <input type="text" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-field">
            <label>Email</label>
            <div className="input-wrap">
              <FiMail />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-field">
            <label>Password</label>
            <div className="input-wrap">
              <FiLock />
              <input
                type={showPass ? 'text' : 'password'}
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
              <button type="button" className="toggle-pass" onClick={() => setShowPass(p => !p)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
