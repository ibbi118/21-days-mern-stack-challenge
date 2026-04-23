import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/axios';
import toast from 'react-hot-toast';
import { FiUsers, FiFilm, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX, FiLogOut } from 'react-icons/fi';
import { logout } from '../features/auth/authSlice';
import './AdminDashboard.scss';

const TABS = ['movies', 'users', 'add-movie'];

const emptyForm = {
  title: '', poster: '', description: '', movieId: '',
  releaseDate: '', trailerLink: '', genre: '', category: 'movie',
};

export default function AdminDashboard() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tab, setTab] = useState('movies');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({ movies: 0, users: 0 });

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadMovies();
    loadUsers();
  }, [user, navigate]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/movies?limit=100');
      setMovies(res.data.movies || []);
      setStats(p => ({ ...p, movies: res.data.total || 0 }));
    } catch { toast.error('Failed to load movies'); }
    finally { setLoading(false); }
  };

  const loadUsers = async () => {
    try {
      const res = await api.get('/users/admin/users');
      setUsers(res.data.users || []);
      setStats(p => ({ ...p, users: res.data.users?.length || 0 }));
    } catch { }
  };

  const handleFormChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        genre: form.genre.split(',').map(g => g.trim()).filter(Boolean),
      };
      if (editingId) {
        await api.put(`/movies/${editingId}`, payload);
        toast.success('Movie updated ✅');
      } else {
        await api.post('/movies', payload);
        toast.success('Movie added ✅');
      }
      setForm(emptyForm);
      setEditingId(null);
      setTab('movies');
      loadMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title || '',
      poster: movie.poster || '',
      description: movie.description || '',
      movieId: movie.movieId || '',
      releaseDate: movie.releaseDate || '',
      trailerLink: movie.trailerLink || '',
      genre: (movie.genre || []).join(', '),
      category: movie.category || 'movie',
    });
    setEditingId(movie._id);
    setTab('add-movie');
  };

  const handleDeleteMovie = async (id) => {
    if (!confirm('Delete this movie?')) return;
    try {
      await api.delete(`/movies/${id}`);
      toast.success('Movie deleted');
      loadMovies();
    } catch { toast.error('Failed to delete'); }
  };

  const handleBanUser = async (id, isBanned) => {
    try {
      await api.put(`/users/admin/users/${id}/${isBanned ? 'unban' : 'ban'}`);
      toast.success(isBanned ? 'User unbanned' : 'User banned');
      loadUsers();
    } catch { toast.error('Action failed'); }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await api.delete(`/users/admin/users/${id}`);
      toast.success('User deleted');
      loadUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div className="admin page-wrapper">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__brand">🎬 CineSpot <span>Admin</span></div>

        <div className="admin__stats">
          <div className="stat-chip"><FiFilm /> {stats.movies} Movies</div>
          <div className="stat-chip"><FiUsers /> {stats.users} Users</div>
        </div>

        <nav className="admin__nav">
          <button className={tab === 'movies' ? 'active' : ''} onClick={() => setTab('movies')}>
            <FiFilm /> Manage Movies
          </button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>
            <FiUsers /> Manage Users
          </button>
          <button className={tab === 'add-movie' ? 'active' : ''} onClick={() => { setForm(emptyForm); setEditingId(null); setTab('add-movie'); }}>
            <FiPlus /> Add Movie
          </button>
        </nav>

        <button className="admin__logout" onClick={() => { dispatch(logout()); navigate('/'); }}>
          <FiLogOut /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="admin__main">
        <div className="admin__topbar">
          <h2 className="admin__page-title">
            {tab === 'movies' && 'Manage Movies'}
            {tab === 'users' && 'Manage Users'}
            {tab === 'add-movie' && (editingId ? 'Edit Movie' : 'Add New Movie')}
          </h2>
          <div className="admin__user-chip">
            <div className="admin__avatar">{user?.name?.charAt(0)}</div>
            {user?.name}
          </div>
        </div>

        {/* Movies Tab */}
        {tab === 'movies' && (
          <div className="admin__section">
            <div className="admin__table-wrap">
              {loading ? (
                <div className="admin__loading">Loading...</div>
              ) : movies.length === 0 ? (
                <div className="admin__empty">
                  <FiFilm />
                  <p>No custom movies added yet.<br />Movies from TMDB are fetched live.</p>
                  <button className="btn-primary" onClick={() => setTab('add-movie')}><FiPlus /> Add Movie</button>
                </div>
              ) : (
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Release</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movies.map(m => (
                      <tr key={m._id}>
                        <td>
                          <div className="movie-row-info">
                            {m.poster && <img src={m.poster} alt={m.title} />}
                            <span>{m.title}</span>
                          </div>
                        </td>
                        <td><span className="badge-cat">{m.category}</span></td>
                        <td>{m.releaseDate || '—'}</td>
                        <td>
                          <div className="action-btns">
                            <button className="action-btn edit" onClick={() => handleEdit(m)}><FiEdit2 /></button>
                            <button className="action-btn delete" onClick={() => handleDeleteMovie(m._id)}><FiTrash2 /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="admin__section">
            <div className="admin__table-wrap">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className={u.isBanned ? 'banned-row' : ''}>
                      <td>
                        <div className="user-info">
                          <div className="user-avatar-sm">{u.name?.charAt(0)}</div>
                          {u.name}
                        </div>
                      </td>
                      <td className="muted">{u.email}</td>
                      <td>
                        <span className={`badge-role ${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        {u.isBanned
                          ? <span className="status banned">Banned</span>
                          : <span className="status active">Active</span>
                        }
                      </td>
                      <td className="muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-btns">
                          {u.role !== 'admin' && (
                            <>
                              <button
                                className={`action-btn ${u.isBanned ? 'unban' : 'ban'}`}
                                onClick={() => handleBanUser(u._id, u.isBanned)}
                                title={u.isBanned ? 'Unban' : 'Ban'}
                              >
                                {u.isBanned ? <FiCheck /> : <FiBan />}
                              </button>
                              <button className="action-btn delete" onClick={() => handleDeleteUser(u._id)} title="Delete">
                                <FiTrash2 />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Movie Tab */}
        {tab === 'add-movie' && (
          <div className="admin__section">
            <div className="admin__form-card">
              <form className="admin__form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Movie Title *</label>
                    <input name="title" value={form.title} onChange={handleFormChange} placeholder="e.g. Inception" required />
                  </div>
                  <div className="form-field">
                    <label>Movie ID (TMDB)</label>
                    <input name="movieId" value={form.movieId} onChange={handleFormChange} placeholder="e.g. 27205" />
                  </div>
                  <div className="form-field">
                    <label>Poster Image URL</label>
                    <input name="poster" value={form.poster} onChange={handleFormChange} placeholder="https://..." />
                  </div>
                  <div className="form-field">
                    <label>Release Date</label>
                    <input name="releaseDate" type="date" value={form.releaseDate} onChange={handleFormChange} />
                  </div>
                  <div className="form-field">
                    <label>Trailer YouTube Link</label>
                    <input name="trailerLink" value={form.trailerLink} onChange={handleFormChange} placeholder="https://youtube.com/watch?v=..." />
                  </div>
                  <div className="form-field">
                    <label>Genre (comma-separated)</label>
                    <input name="genre" value={form.genre} onChange={handleFormChange} placeholder="Action, Drama, Sci-Fi" />
                  </div>
                  <div className="form-field">
                    <label>Category</label>
                    <select name="category" value={form.category} onChange={handleFormChange}>
                      <option value="movie">Movie</option>
                      <option value="tv">TV Show</option>
                      <option value="trending">Trending</option>
                      <option value="popular">Popular</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label>Description</label>
                    <textarea name="description" value={form.description} onChange={handleFormChange} placeholder="Movie description..." rows={4} />
                  </div>
                </div>

                {form.poster && (
                  <div className="poster-preview">
                    <img src={form.poster} alt="Poster preview" onError={e => e.target.style.display = 'none'} />
                    <span>Poster Preview</span>
                  </div>
                )}

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingId ? <><FiCheck /> Update Movie</> : <><FiPlus /> Add Movie</>}
                  </button>
                  {editingId && (
                    <button type="button" className="btn-secondary" onClick={() => { setForm(emptyForm); setEditingId(null); }}>
                      <FiX /> Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
