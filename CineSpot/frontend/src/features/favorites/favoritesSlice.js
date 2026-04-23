import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/favorites');
    return res.data.favorites;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addFavorite = createAsyncThunk('favorites/add', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/users/favorites', data);
    return res.data.favorite;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (tmdbId, { rejectWithValue }) => {
  try {
    await api.delete(`/users/favorites/${tmdbId}`);
    return tmdbId;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.fulfilled, (state, a) => { state.items = a.payload; })
      .addCase(addFavorite.fulfilled, (state, a) => { state.items.unshift(a.payload); })
      .addCase(removeFavorite.fulfilled, (state, a) => {
        state.items = state.items.filter(f => f.tmdbId !== a.payload);
      });
  },
});

export default favoritesSlice.reducer;
