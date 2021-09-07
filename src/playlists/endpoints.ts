const BASE = 'https://api.spotify.com';

export const PLAYLISTS = `${BASE}/v1/playlists`;

export const PLAYLIST = `${PLAYLISTS}/{playlist_id}`;

export const PLAYLIST_TRACKS = `${PLAYLIST}/tracks`;

export const USER_PLAYLISTS = `${BASE}/v1/users/{user_id}/playlists`;

export const MY_PLAYLISTS = `${BASE}/v1/me/playlists`;

export const PLAYLIST_IMAGES = `${PLAYLIST}/images`;
