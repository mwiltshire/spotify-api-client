import {
  Response,
  LimitOption,
  AfterOption,
  CursorBasedPagingArtistsObject,
  IdsObject,
  PlaylistIdObject
} from '../types';

export type IsFollowingArtistsOrUsersParameters = IdsObject;

export type IsFollowingArtistsOrUsersResponse = Promise<Response<boolean[]>>;

export type AreFollowingPlaylistParameters = PlaylistIdObject & IdsObject;

export type AreFollowingPlaylistResponse = Promise<Response<boolean[]>>;

export type FollowArtistsOrUsersParameters = IdsObject;

export type FollowArtistsOrUsersResponse = Promise<Response<void>>;

export interface FollowPlaylistParameters extends PlaylistIdObject {
  /** If true the playlist will be included the in user’s
   * public playlists, if false it will remain private. */
  public?: boolean;
}

export type FollowPlaylistResponse = Promise<Response<void>>;

export type GetFollowedArtistsParameters = LimitOption & AfterOption;

export type GetFollowedArtistsResponse = Promise<
  Response<CursorBasedPagingArtistsObject>
>;

export type UnfollowArtistsOrUsersParameters = IdsObject;

export type UnfollowArtistsOrUsersResponse = Promise<Response<void>>;

export type UnfollowPlaylistParameters = PlaylistIdObject;

export type UnfollowPlaylistResponse = Promise<Response<void>>;
