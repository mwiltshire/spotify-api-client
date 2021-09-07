import {
  Response,
  LimitOption,
  OffsetOption,
  MarketOption,
  PlaylistObject,
  PagingObject,
  SimplifiedPlaylistObject,
  ImageObject,
  PlaylistTrackObject,
  TrackObject,
  EpisodeObject
} from '../types';

export interface SnapshotId {
  /** The Spotify snapshot ID for the playlist. */
  snapshot_id: string;
}

export interface PlaylistId {
  /** The Spotify ID for the playlist. */
  playlist_id: string;
}

export interface PlaylistParameters {
  /** The new name for the playlist. */
  name: string;
  /** If `true` the playlist will be public, if `false`
   * it will be private. */
  public?: boolean;
  /** If `true`, the playlist will become collaborative
   * and other users will be able to modify the playlist
   * in their Spotify client. Note: You can only set
   * collaborative to true on non-public
   * playlists. */
  collaborative?: boolean;
  /** Value for playlist description as displayed in
   * Spotify clients and in the Web API. */
  description?: string;
}

export interface AddItemsToPlaylistParameters extends PlaylistId {
  /** Array of Spotify URIs to add. A maximum of 100 can
   * be added in a single request. */
  uris: string[];
  /** The position to insert the items at, a zero-based
   * index. */
  position?: number;
}

export type AddItemsToPlaylistResponse = Promise<Response<SnapshotId>>;

export interface ChangeDetailsForPlaylistParameters
  extends Partial<PlaylistParameters>,
    PlaylistId {}

export type ChangeDetailsForPlaylistResponse = Promise<Response<void>>;

export interface CreatePlaylistParameters extends PlaylistParameters {
  /** The Spotify user ID. */
  user_id: string;
}

export type CreatePlaylistResponse = Promise<Response<PlaylistObject>>;

export interface GetMyPlaylistsParameters extends LimitOption, OffsetOption {}

export type GetPlaylistsResponse = Promise<
  Response<PagingObject<SimplifiedPlaylistObject>>
>;

export interface GetPlaylistsForUserParameters
  extends LimitOption,
    OffsetOption {
  /** The Spotify user ID. */
  user_id: string;
}

export type PlaylistItemType =
  | ['track']
  | ['episode']
  | ['track', 'episode']
  | ['episode', 'track'];

export interface GetPlaylistParameters<T> extends MarketOption, PlaylistId {
  /** Filters for the query: Array of fields to return.
   * If omitted, all fields are returned. */
  fields?: string[];
  /** Array of item types that your client supports besides
   * the default track type. Valid types are: `'track'` and
   * `'episode'`. */
  additional_types?: T;
}

export type GetPlaylistResponse<T> = Promise<
  Response<
    PagingObject<
      PlaylistObject<
        T extends undefined | ['track']
          ? TrackObject
          : TrackObject | EpisodeObject
      >
    >
  >
>;

export type GetCoverImageForPlaylistParameters = PlaylistId;

export type GetCoverImageForPlaylistResponse = Promise<Response<ImageObject[]>>;

export interface ListItemsInPlaylistParameters<T>
  extends GetPlaylistParameters<T>,
    LimitOption,
    OffsetOption {}

export type ListItemsInPlaylistResponse<T> = Promise<
  Response<
    PagingObject<
      PlaylistTrackObject<
        T extends undefined | ['track']
          ? TrackObject
          : TrackObject | EpisodeObject
      >
    >
  >
>;

export interface PlaylistTrack {
  /** Spotify URI for the playlist item */
  uri: string;
  /** The positions of the item in the playlist.
   * Zero-indexed.
   */
  positions?: number[];
}

export interface RemoveItemsFromPlaylistParameters
  extends PlaylistId,
    Partial<SnapshotId> {
  /** An array of objects containing Spotify URIs
   * and optional positions of the tracks or episodes
   * to remove. */
  tracks: PlaylistTrack[];
}

export type RemoveItemsFromPlaylistResponse = Promise<Response<SnapshotId>>;

export interface ReorderItemsInPlaylistParameters
  extends PlaylistId,
    Partial<SnapshotId> {
  /** The position of the first item to be reordered. */
  range_start: number;
  /** The position where the items should be inserted. */
  insert_before: number;
  /** The amount of items to be reordered. */
  range_length?: number;
}

export type ReorderItemsInPlaylistResponse = Promise<Response<SnapshotId>>;

export interface ReplaceItemsInPlaylistParameters extends PlaylistId {
  /** Array of Spotify URIs. A maximum of 100 items can
   * be set in one request. */
  uris?: string[];
}

export type ReplaceItemsInPlaylistResponse = Promise<Response<void>>;

export interface UploadCoverImageForPlaylistParameters extends PlaylistId {
  /** Base64 encoded JPEG image data, maximum payload
   * size is 256 KB. */
  image: string;
}

export type UploadCoverImageForPlaylistResponse = Promise<Response<void>>;
