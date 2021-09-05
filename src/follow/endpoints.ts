const BASE = 'https://api.spotify.com';

export const FOLLOWING = `${BASE}/v1/me/following`;

export const FOLLOWING_CONTAINS = `${FOLLOWING}/contains`;

export const PLAYLIST_FOLLOWERS = `${BASE}/v1/playlists/{playlist_id}/followers`;

export const PLAYLIST_FOLLOWERS_CONTAINS = `${PLAYLIST_FOLLOWERS}/contains`;
