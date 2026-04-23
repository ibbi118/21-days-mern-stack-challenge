import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tmdbAPI from '../../services/tmdbAPI';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const res = await tmdbAPI.getTrending();
    return res.data.results;
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async (page = 1, { rejectWithValue }) => {
  try {
    const res = await tmdbAPI.getPopularMovies(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchPopularTV = createAsyncThunk('movies/fetchTV', async (page = 1, { rejectWithValue }) => {
  try {
    const res = await tmdbAPI.getPopularTV(page);
    return { results: res.data.results, page: res.data.page };
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchMovieDetails = createAsyncThunk('movies/fetchDetails', async ({ id, type }, { rejectWithValue }) => {
  try {
    const [details, videos, credits] = await Promise.all([
      type === 'tv' ? tmdbAPI.getTVDetails(id) : tmdbAPI.getMovieDetails(id),
      type === 'tv' ? tmdbAPI.getTVVideos(id) : tmdbAPI.getMovieVideos(id),
      type === 'tv' ? tmdbAPI.getTVCredits(id) : tmdbAPI.getMovieCredits(id),
    ]);
    return {
      ...details.data,
      videos: videos.data.results,
      credits: credits.data,
      mediaType: type,
    };
  } catch (err) { return rejectWithValue(err.message); }
});

export const fetchMoodMovies = createAsyncThunk('movies/fetchMood', async (genreIds, { rejectWithValue }) => {
  try {
    const res = await tmdbAPI.discoverByMood(genreIds);
    return res.data.results;
  } catch (err) { return rejectWithValue(err.message); }
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    popular: [],
    popularPage: 1,
    tv: [],
    details: null,
    moodMovies: [],
    loading: false,
    detailsLoading: false,
    moodLoading: false,
    error: null,
  },
  reducers: {
    clearDetails: (state) => { state.details = null; },
    clearMoodMovies: (state) => { state.moodMovies = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.loading = true; })
      .addCase(fetchTrending.fulfilled, (state, a) => { state.loading = false; state.trending = a.payload; })
      .addCase(fetchTrending.rejected, (state, a) => { state.loading = false; state.error = a.payload; })
      .addCase(fetchPopularMovies.fulfilled, (state, a) => {
        state.popular = a.payload.page === 1 ? a.payload.results : [...state.popular, ...a.payload.results];
        state.popularPage = a.payload.page;
      })
      .addCase(fetchPopularTV.fulfilled, (state, a) => { state.tv = a.payload.results; })
      .addCase(fetchMovieDetails.pending, (state) => { state.detailsLoading = true; state.details = null; })
      .addCase(fetchMovieDetails.fulfilled, (state, a) => { state.detailsLoading = false; state.details = a.payload; })
      .addCase(fetchMovieDetails.rejected, (state, a) => { state.detailsLoading = false; state.error = a.payload; })
      .addCase(fetchMoodMovies.pending, (state) => { state.moodLoading = true; })
      .addCase(fetchMoodMovies.fulfilled, (state, a) => { state.moodLoading = false; state.moodMovies = a.payload; })
      .addCase(fetchMoodMovies.rejected, (state) => { state.moodLoading = false; });
  },
});

export const { clearDetails, clearMoodMovies } = movieSlice.actions;
export default movieSlice.reducer;
