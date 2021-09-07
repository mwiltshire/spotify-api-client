import { SEARCH } from './endpoints';
import { get } from '../http/request';
import {
  SearchType,
  SearchResponse,
  SearchParameters,
  SearchAlbumsResponse,
  SearchArtistsResponse,
  SearchEpisodesResponse,
  SearchPlaylistsResponse,
  SearchShowsResponse,
  SearchTracksResponse
} from './types';
import { Fetcher } from '../types';

export function searchAlbums(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchAlbumsResponse {
  return search(client, { type: 'album', ...parameters });
}

export function searchArtists(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchArtistsResponse {
  return search(client, { type: 'artist', ...parameters });
}

export function searchEpisodes(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchEpisodesResponse {
  return search(client, { type: 'episode', ...parameters });
}

export function searchPlaylists(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchPlaylistsResponse {
  return search(client, { type: 'playlist', ...parameters });
}

export function searchShows(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchShowsResponse {
  return search(client, { type: 'show', ...parameters });
}

export function searchTracks(
  client: Fetcher,
  parameters: Omit<SearchParameters, 'type'>
): SearchTracksResponse {
  return search(client, { type: 'track', ...parameters });
}

export function search<T extends SearchType | SearchType[]>(
  client: Fetcher,
  parameters: SearchParameters<T>
): SearchResponse<T> {
  return client(get({ url: SEARCH, params: parameters }));
}
