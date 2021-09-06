import * as ENDPOINTS from './endpoints';
import { delete_, get, put } from '../http/request';
import {
  CheckLibraryParameters,
  RemoveSavedAlbumsParameters,
  RemoveSavedShowsParameters,
  RemoveSavedTracksParameters,
  SaveToLibraryParameters,
  CheckLibraryResponse,
  GetSavedAlbumsParameters,
  GetSavedAlbumsResponse,
  GetSavedShowsParameters,
  GetSavedShowsResponse,
  GetSavedTracksParameters,
  GetSavedTracksResponse,
  RemoveFromLibraryResponse,
  SaveToLibraryResponse
} from './types';
import { Fetcher } from '../types';

export function checkSavedAlbums(
  client: Fetcher,
  parameters: CheckLibraryParameters
): CheckLibraryResponse {
  return client(
    get({
      url: ENDPOINTS.CONTAINS_ALBUMS,
      params: parameters
    })
  );
}

export function checkSavedShows(
  client: Fetcher,
  parameters: CheckLibraryParameters
): CheckLibraryResponse {
  return client(
    get({
      url: ENDPOINTS.CONTAINS_SHOWS,
      params: parameters
    })
  );
}

export function checkSavedTracks(
  client: Fetcher,
  parameters: CheckLibraryParameters
): CheckLibraryResponse {
  return client(
    get({
      url: ENDPOINTS.CONTAINS_TRACKS,
      params: parameters
    })
  );
}

export function getSavedAlbums(
  client: Fetcher,
  parameters: GetSavedAlbumsParameters = {}
): GetSavedAlbumsResponse {
  return client(get({ url: ENDPOINTS.ALBUMS, params: parameters }));
}

export function getSavedShows(
  client: Fetcher,
  parameters: GetSavedShowsParameters = {}
): GetSavedShowsResponse {
  return client(get({ url: ENDPOINTS.SHOWS, params: parameters }));
}

export function getSavedTracks(
  client: Fetcher,
  parameters: GetSavedTracksParameters = {}
): GetSavedTracksResponse {
  return client(get({ url: ENDPOINTS.TRACKS, params: parameters }));
}

export function removeSavedAlbums(
  client: Fetcher,
  parameters: RemoveSavedAlbumsParameters
): RemoveFromLibraryResponse {
  return client(delete_({ url: ENDPOINTS.ALBUMS, params: parameters }));
}

export function removeSavedShows(
  client: Fetcher,
  parameters: RemoveSavedShowsParameters
): RemoveFromLibraryResponse {
  return client(delete_({ url: ENDPOINTS.SHOWS, params: parameters }));
}

export function removeSavedTracks(
  client: Fetcher,
  parameters: RemoveSavedTracksParameters
): RemoveFromLibraryResponse {
  return client(delete_({ url: ENDPOINTS.TRACKS, params: parameters }));
}

export function saveAlbums(
  client: Fetcher,
  parameters: SaveToLibraryParameters
): SaveToLibraryResponse {
  return client(put({ url: ENDPOINTS.ALBUMS, params: parameters }));
}

export function saveShows(
  client: Fetcher,
  parameters: SaveToLibraryParameters
): SaveToLibraryResponse {
  return client(put({ url: ENDPOINTS.SHOWS, params: parameters }));
}

export function saveTracks(
  client: Fetcher,
  parameters: SaveToLibraryParameters
): SaveToLibraryResponse {
  return client(put({ url: ENDPOINTS.TRACKS, params: parameters }));
}
