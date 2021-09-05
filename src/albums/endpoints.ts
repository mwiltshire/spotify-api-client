const BASE = 'https://api.spotify.com';

export const ALBUMS = `${BASE}/v1/albums`;

export const ALBUM = `${ALBUMS}/{id}`;

export const ALBUM_TRACKS = `${ALBUM}/tracks`;
