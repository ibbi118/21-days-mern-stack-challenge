import axios from 'axios';

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE,
  params: { api_key: TMDB_KEY, language: 'en-US' },
});

export const IMG = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : '/placeholder.jpg';

export const tmdbAPI = {
  getTrending: (type = 'all', window = 'week') =>
    tmdb.get(`/trending/${type}/${window}`),
  getPopularMovies: (page = 1) =>
    tmdb.get('/movie/popular', { params: { page } }),
  getPopularTV: (page = 1) =>
    tmdb.get('/tv/popular', { params: { page } }),
  getMovieDetails: (id) => tmdb.get(`/movie/${id}`),
  getTVDetails: (id) => tmdb.get(`/tv/${id}`),
  getMovieVideos: (id) => tmdb.get(`/movie/${id}/videos`),
  getTVVideos: (id) => tmdb.get(`/tv/${id}/videos`),
  getMovieCredits: (id) => tmdb.get(`/movie/${id}/credits`),
  getTVCredits: (id) => tmdb.get(`/tv/${id}/credits`),
  getSimilar: (id, type = 'movie') => tmdb.get(`/${type}/${id}/similar`),
  search: (query, page = 1) =>
    tmdb.get('/search/multi', { params: { query, page } }),
  getPersonDetails: (id) => tmdb.get(`/person/${id}`),
  getPersonMovies: (id) => tmdb.get(`/person/${id}/movie_credits`),
  getUpcoming: () => tmdb.get('/movie/upcoming'),
  getNowPlaying: () => tmdb.get('/movie/now_playing'),
  getTopRated: (type = 'movie') => tmdb.get(`/${type}/top_rated`),
  getGenres: (type = 'movie') => tmdb.get(`/genre/${type}/list`),
  discoverByMood: (genreIds) =>
    tmdb.get('/discover/movie', { params: { with_genres: genreIds.join(','), sort_by: 'popularity.desc' } }),
};

export default tmdbAPI;
