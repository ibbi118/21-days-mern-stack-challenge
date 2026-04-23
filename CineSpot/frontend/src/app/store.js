import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movies/movieSlice';
import searchReducer from '../features/search/searchSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import historyReducer from '../features/history/historySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    search: searchReducer,
    favorites: favoritesReducer,
    history: historyReducer,
  },
});
