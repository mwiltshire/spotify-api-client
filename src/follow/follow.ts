import * as ENDPOINTS from './endpoints';
import { formatPathParams } from '../utils';
import { delete_, get, put } from '../http/request';
import {
  AreFollowingPlaylistResponse,
  AreFollowingPlaylistParameters,
  FollowArtistsOrUsersResponse,
  FollowArtistsOrUsersParameters,
  FollowPlaylistResponse,
  FollowPlaylistParameters,
  GetFollowedArtistsResponse,
  GetFollowedArtistsParameters,
  IsFollowingArtistsOrUsersResponse,
  IsFollowingArtistsOrUsersParameters,
  UnfollowArtistsOrUsersResponse,
  UnfollowArtistsOrUsersParameters,
  UnfollowPlaylistResponse,
  UnfollowPlaylistParameters
} from './types';
import { Fetcher } from '../types';

export function isFollowingArtists(
  client: Fetcher,
  parameters: IsFollowingArtistsOrUsersParameters
): IsFollowingArtistsOrUsersResponse {
  return client(
    get({
      url: ENDPOINTS.FOLLOWING_CONTAINS,
      params: {
        type: 'artist',
        ...parameters
      }
    })
  );
}

export function isFollowingUsers(
  client: Fetcher,
  parameters: IsFollowingArtistsOrUsersParameters
): IsFollowingArtistsOrUsersResponse {
  return client(
    get({
      url: ENDPOINTS.FOLLOWING_CONTAINS,
      params: {
        type: 'user',
        ...parameters
      }
    })
  );
}

export function areFollowingPlaylist(
  client: Fetcher,
  parameters: AreFollowingPlaylistParameters
): AreFollowingPlaylistResponse {
  const { playlist_id, ids } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_FOLLOWERS_CONTAINS,
    parameters: { playlist_id }
  });
  return client(get({ url, params: { ids } }));
}

export function followArtists(
  client: Fetcher,
  parameters: FollowArtistsOrUsersParameters
): FollowArtistsOrUsersResponse {
  return client(
    put({
      url: ENDPOINTS.FOLLOWING,
      params: {
        type: 'artist',
        ...parameters
      }
    })
  );
}

export function followUsers(
  client: Fetcher,
  parameters: FollowArtistsOrUsersParameters
): FollowArtistsOrUsersResponse {
  return client(
    put({
      url: ENDPOINTS.FOLLOWING,
      params: {
        type: 'user',
        ...parameters
      }
    })
  );
}

export function followPlaylist(
  client: Fetcher,
  parameters: FollowPlaylistParameters
): FollowPlaylistResponse {
  const { playlist_id, ...rest } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_FOLLOWERS,
    parameters: { playlist_id }
  });
  return client(put({ url, body: { ...rest } }));
}

export function getFollowedArtists(
  client: Fetcher,
  parameters: GetFollowedArtistsParameters = {}
): GetFollowedArtistsResponse {
  return client(
    get({
      url: ENDPOINTS.FOLLOWING,
      params: {
        type: 'artist',
        ...parameters
      }
    })
  );
}

export function unfollowArtists(
  client: Fetcher,
  parameters: UnfollowArtistsOrUsersParameters
): UnfollowArtistsOrUsersResponse {
  return client(
    delete_({
      url: ENDPOINTS.FOLLOWING,
      params: {
        type: 'artist',
        ...parameters
      }
    })
  );
}

export function unfollowUsers(
  client: Fetcher,
  parameters: UnfollowArtistsOrUsersParameters
): UnfollowArtistsOrUsersResponse {
  return client(
    delete_({
      url: ENDPOINTS.FOLLOWING,
      params: {
        type: 'user',
        ...parameters
      }
    })
  );
}

export function unfollowPlaylist(
  client: Fetcher,
  parameters: UnfollowPlaylistParameters
): UnfollowPlaylistResponse {
  const { playlist_id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.PLAYLIST_FOLLOWERS,
    parameters: { playlist_id }
  });
  return client(delete_({ url }));
}
