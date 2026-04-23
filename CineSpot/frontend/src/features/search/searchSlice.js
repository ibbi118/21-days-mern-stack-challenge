import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../../services/tmdbAPI';

export const searchContent = createAsyncThunk('search/search', async ({ query, page = 1 }, { rejectWithValue }) => {
  try {
    const res = await tmdbAPI.search(query, page);
    return { results: res.data.results, page, totalPages: res.data.total_pages, query };
  } catch (err) { return rejectWithValue(err.message); }
});

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    query: '',
    page: 1,
    totalPages: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => { state.query = action.payload; },
    clearSearch: (state) => { state.results = []; state.query = ''; state.page = 1; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchContent.pending, (state) => { state.loading = true; })
      .addCase(searchContent.fulfilled, (state, a) => {
        state.loading = false;
        state.results = a.payload.page === 1 ? a.payload.results : [...state.results, ...a.payload.results];
        state.page = a.payload.page;
        state.totalPages = a.payload.totalPages;
        state.query = a.payload.query;
      })
      .addCase(searchContent.rejected, (state) => { state.loading = false; });
  },
});

export const { setQuery, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
