import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import { getMe } from './features/auth/authSlice';
import { fetchFavorites } from './features/favorites/favoritesSlice';
import './styles/globals.scss';

function AppInner() {
  useEffect(() => {
    const token = localStorage.getItem('cinespot_token');
    if (token) {
      store.dispatch(getMe()).then((res) => {
        if (!res.error) {
          store.dispatch(fetchFavorites());
        }
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <AppRoutes />
      <Footer />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-elevated)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
          },
          success: {
            iconTheme: { primary: '#f5c518', secondary: '#000' },
          },
          error: {
            iconTheme: { primary: '#e63946', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppInner />
    </Provider>
  );
}
