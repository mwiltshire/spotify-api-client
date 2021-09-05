const BASE = 'https://api.spotify.com';

export const RECOMMENDATIONS = `${BASE}/v1/recommendations`;

export const RECOMMENDATION_GENRES = `${RECOMMENDATIONS}/available-genre-seeds`;

export const BROWSE = `${BASE}/v1/browse`;

export const CATEGORIES = `${BROWSE}/categories`;

export const CATEGORY = `${CATEGORIES}/{category_id}`;

export const PLAYLISTS_FOR_CATEGORY = `${CATEGORY}/playlists`;

export const FEATURED_PLAYLISTS = `${BROWSE}/featured-playlists`;

export const NEW_RELEASES = `${BROWSE}/new-releases`;
