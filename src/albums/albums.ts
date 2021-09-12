import * as ENDPOINTS from './endpoints';
import { formatPathParams } from '../utils';
import { get } from '../http/request';
import {
  GetAlbumParameters,
  GetTracksForAlbumParameters,
  GetAlbumsParameters,
  GetAlbumResponse,
  GetTracksForAlbumResponse,
  GetAlbumsResponse
} from './types';
import { Fetcher } from '../types';

export function getAlbum(
  client: Fetcher,
  parameters: GetAlbumParameters
): GetAlbumResponse {
  const { id, ...rest } = parameters;
  const url = formatPathParams({ url: ENDPOINTS.ALBUM, parameters: { id } });
  return client(get({ url, params: rest }));
}

export function getTracksForAlbum(
  client: Fetcher,
  parameters: GetTracksForAlbumParameters
): GetTracksForAlbumResponse {
  const { id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.ALBUM_TRACKS,
    parameters: { id }
  });
  return client(get({ url, params: rest }));
}

export function getAlbums(
  client: Fetcher,
  parameters: GetAlbumsParameters
): GetAlbumsResponse {
  return client(get({ url: ENDPOINTS.ALBUMS, params: parameters }));
}
