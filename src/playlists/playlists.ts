import * as ENDPOINTS from './endpoints';
import { delete_, get, post, put } from '../http/request';
import { formatPathParams } from '../utils';
import {
  AddItemsToPlaylistParameters,
  ChangeDetailsForPlaylistParameters,
  CreatePlaylistParameters,
  GetPlaylistParameters,
  GetCoverImageForPlaylistParameters,
  ListItemsInPlaylistParameters,
  RemoveItemsFromPlaylistParameters,
  ReorderItemsInPlaylistParameters,
  ReplaceItemsInPlaylistParameters,
  UploadCoverImageForPlaylistParameters,
  PlaylistItemType,
  AddItemsToPlaylistResponse,
  ChangeDetailsForPlaylistResponse,
  CreatePlaylistResponse,
  GetCoverImageForPlaylistResponse,
  GetPlaylistResponse,
  GetPlaylistsResponse,
  ListItemsInPlaylistResponse,
  RemoveItemsFromPlaylistResponse,
  ReorderItemsInPlaylistResponse,
  ReplaceItemsInPlaylistResponse,
  UploadCoverImageForPlaylistResponse,
  GetMyPlaylistsParameters,
  GetPlaylistsForUserParameters
} from './types';
import { Fetcher } from '../types';

export function addItemsToPlaylist(
  client: Fetcher,
  parameters: AddItemsToPlaylistParameters
): AddItemsToPlaylistResponse {
  const { playlist_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_TRACKS,
    parameters: { playlist_id }
  });
  return client(post({ url, body }));
}

export function changeDetailsForPlaylist(
  client: Fetcher,
  parameters: ChangeDetailsForPlaylistParameters
): ChangeDetailsForPlaylistResponse {
  const { playlist_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST,
    parameters: { playlist_id }
  });
  return client(put({ url, body }));
}

export function createPlaylist(
  client: Fetcher,
  parameters: CreatePlaylistParameters
): CreatePlaylistResponse {
  const { user_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.USER_PLAYLISTS,
    parameters: { user_id: encodeURIComponent(user_id) }
  });
  return client(post({ url, body }));
}

export function getMyPlaylists(
  client: Fetcher,
  parameters: GetMyPlaylistsParameters = {}
): GetPlaylistsResponse {
  return client(get({ url: ENDPOINTS.MY_PLAYLISTS, params: parameters }));
}

export function getPlaylistsForUser(
  client: Fetcher,
  parameters: GetPlaylistsForUserParameters
): GetPlaylistsResponse {
  const { user_id, ...params } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.USER_PLAYLISTS,
    parameters: { user_id: encodeURIComponent(user_id) }
  });
  return client(get({ url, params }));
}

export function getPlaylist<T extends PlaylistItemType | undefined = undefined>(
  client: Fetcher,
  parameters: GetPlaylistParameters<T>
): GetPlaylistResponse<T> {
  const { playlist_id, ...params } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST,
    parameters: { playlist_id }
  });
  return client(get({ url, params }));
}

export function getCoverImageForPlaylist(
  client: Fetcher,
  parameters: GetCoverImageForPlaylistParameters
): GetCoverImageForPlaylistResponse {
  const { playlist_id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_IMAGES,
    parameters: { playlist_id }
  });
  return client(get({ url }));
}

export function listItemsInPlaylist<
  T extends PlaylistItemType | undefined = undefined
>(
  client: Fetcher,
  parameters: ListItemsInPlaylistParameters<T>
): ListItemsInPlaylistResponse<T> {
  const { playlist_id, ...params } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_TRACKS,
    parameters: { playlist_id }
  });
  return client(get({ url, params }));
}

export function removeItemsFromPlaylist(
  client: Fetcher,
  parameters: RemoveItemsFromPlaylistParameters
): RemoveItemsFromPlaylistResponse {
  const { playlist_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_TRACKS,
    parameters: { playlist_id }
  });
  return client(delete_({ url, body }));
}

export function reorderItemsInPlaylist(
  client: Fetcher,
  parameters: ReorderItemsInPlaylistParameters
): ReorderItemsInPlaylistResponse {
  const { playlist_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_TRACKS,
    parameters: { playlist_id }
  });
  return client(put({ url, body }));
}

export function replaceItemsInPlaylist(
  client: Fetcher,
  parameters: ReplaceItemsInPlaylistParameters
): ReplaceItemsInPlaylistResponse {
  const { playlist_id, ...body } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_TRACKS,
    parameters: { playlist_id }
  });
  return client(put({ url, body }));
}

export function uploadCoverImageForPlaylist(
  client: Fetcher,
  parameters: UploadCoverImageForPlaylistParameters
): UploadCoverImageForPlaylistResponse {
  const { playlist_id, image } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_IMAGES,
    parameters: { playlist_id }
  });
  return client(
    put({
      url,
      body: image,
      headers: { 'Content-Type': 'image/jpeg' }
    })
  );
}
