const BASE = 'https://api.spotify.com';

export const ME = `${BASE}/v1/me`;

export const ALBUMS = `${ME}/albums`;

export const SHOWS = `${ME}/shows`;

export const TRACKS = `${ME}/tracks`;

export const CONTAINS_ALBUMS = `${ALBUMS}/contains`;

export const CONTAINS_SHOWS = `${SHOWS}/contains`;

export const CONTAINS_TRACKS = `${TRACKS}/contains`;
