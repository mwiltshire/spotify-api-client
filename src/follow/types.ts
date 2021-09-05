import {
  Response,
  LimitOption,
  AfterOption,
  ArtistObject,
  CursorBasedPagingObject
} from '../types';

export interface PlaylistIdParameter {
  /**	The Spotify ID of the playlist. */
  playlist_id: string;
}

export interface IdsParameter {
  /** Array of Spotify IDs. */
  ids: string[];
}

export type IsFollowingArtistsOrUsersParameters = IdsParameter;

export type IsFollowingArtistsOrUsersResponse = Promise<Response<boolean[]>>;

export interface AreFollowingPlaylistParameters
  extends PlaylistIdParameter,
    IdsParameter {}

export type AreFollowingPlaylistResponse = Promise<Response<boolean[]>>;

export type FollowArtistsOrUsersParameters = IdsParameter;

export type FollowArtistsOrUsersResponse = Promise<Response<void>>;

export interface FollowPlaylistParameters extends PlaylistIdParameter {
  /** If true the playlist will be included the in user’s
   * public playlists, if false it will remain private. */
  public?: boolean;
}

export type FollowPlaylistResponse = Promise<Response<void>>;

export type GetFollowedArtistsParameters = LimitOption & AfterOption;

export interface FollowedArtists {
  artists: CursorBasedPagingObject<ArtistObject>;
}

export type GetFollowedArtistsResponse = Promise<Response<FollowedArtists>>;

export type UnfollowArtistsOrUsersParameters = IdsParameter;

export type UnfollowArtistsOrUsersResponse = Promise<Response<void>>;

export type UnfollowPlaylistParameters = PlaylistIdParameter;

export type UnfollowPlaylistResponse = Promise<Response<void>>;
