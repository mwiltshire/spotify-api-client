const BASE = 'https://api.spotify.com';

export const TRACKS = `${BASE}/v1/tracks`;

export const TRACK = `${TRACKS}/{id}`;

export const AUDIO_FEATURES = `${BASE}/v1/audio-features`;

export const AUDIO_FEATURES_FOR_TRACK = `${AUDIO_FEATURES}/{id}`;

export const AUDIO_ANALYSIS_FOR_TRACK = `${BASE}/v1/audio-analysis/{id}`;
