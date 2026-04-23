import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/axios';

export const fetchHistory = createAsyncThunk('history/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/history');
    return res.data.history;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const addToHistory = createAsyncThunk('history/add', async (data, { rejectWithValue }) => {
  try {
    await api.post('/users/history', data);
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const clearHistory = createAsyncThunk('history/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/users/history');
    return true;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const historySlice = createSlice({
  name: 'history',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, a) => { state.items = a.payload; })
      .addCase(addToHistory.fulfilled, (state, a) => {
        state.items = state.items.filter(h => h.tmdbId !== a.payload.tmdbId);
        state.items.unshift({ ...a.payload, watchedAt: new Date().toISOString() });
      })
      .addCase(clearHistory.fulfilled, (state) => { state.items = []; });
  },
});

export default historySlice.reducer;
