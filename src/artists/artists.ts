import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import { formatPathParams } from '../utils';
import {
  GetArtistParameters,
  GetAlbumsForArtistParameters,
  GetTopTracksForArtistParameters,
  GetRelatedArtistsForArtistParameters,
  GetArtistsParameters,
  GetRelatedArtistsForArtistResponse,
  GetAlbumsForArtistResponse,
  GetArtistResponse,
  GetArtistsResponse,
  GetTopTracksForArtistResponse
} from './types';
import { Fetcher } from '../types';

export function getArtist(
  client: Fetcher,
  parameters: GetArtistParameters
): GetArtistResponse {
  const { id } = parameters;
  const url = formatPathParams({ url: ENDPOINTS.ARTIST, parameters: { id } });
  return client(get({ url }));
}

export function getAlbumsForArtist(
  client: Fetcher,
  parameters: GetAlbumsForArtistParameters
): GetAlbumsForArtistResponse {
  const { id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.ARTIST_ALBUMS,
    parameters: { id }
  });
  return client(get({ url, params: rest }));
}

export function getTopTracksForArtist(
  client: Fetcher,
  parameters: GetTopTracksForArtistParameters
): GetTopTracksForArtistResponse {
  const { id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.ARTIST_TOP_TRACKS,
    parameters: { id }
  });
  return client(get({ url, params: rest }));
}

export function getRelatedArtistsForArtist(
  client: Fetcher,
  parameters: GetRelatedArtistsForArtistParameters
): GetRelatedArtistsForArtistResponse {
  const { id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.ARTIST_RELATED_ARTISTS,
    parameters: { id }
  });
  return client(get({ url }));
}

export function getArtists(
  client: Fetcher,
  parameters: GetArtistsParameters
): GetArtistsResponse {
  return client(get({ url: ENDPOINTS.ARTISTS, params: parameters }));
}
