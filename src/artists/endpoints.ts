const BASE = 'https://api.spotify.com';

export const ARTISTS = `${BASE}/v1/artists`;

export const ARTIST = `${ARTISTS}/{id}`;

export const ARTIST_ALBUMS = `${ARTIST}/albums`;

export const ARTIST_TOP_TRACKS = `${ARTIST}/top-tracks`;

export const ARTIST_RELATED_ARTISTS = `${ARTIST}/related-artists`;
