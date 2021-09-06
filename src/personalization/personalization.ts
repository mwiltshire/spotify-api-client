import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import {
  GetMyTopArtistsResponse,
  GetMyTopArtistsOrTracksParameters,
  GetMyTopTracksResponse
} from './types';
import { Fetcher } from '../types';

export function getMyTopArtists(
  client: Fetcher,
  parameters: GetMyTopArtistsOrTracksParameters = {}
): GetMyTopArtistsResponse {
  return client(get({ url: ENDPOINTS.TOP_ARTISTS, params: parameters }));
}

export function getMyTopTracks(
  client: Fetcher,
  parameters: GetMyTopArtistsOrTracksParameters = {}
): GetMyTopTracksResponse {
  return client(get({ url: ENDPOINTS.TOP_TRACKS, params: parameters }));
}
