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
  EpisodeObject,
  PlaylistIdObject,
  SnapshotIdObject,
  UserIdObject,
  UrisObject,
  PositionObject,
  UriObject,
  PositionsObject
} from '../types';

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

export type AddItemsToPlaylistParameters = PlaylistIdObject &
  UrisObject &
  Partial<PositionObject>;

export type AddItemsToPlaylistResponse = Promise<Response<SnapshotIdObject>>;

export type ChangeDetailsForPlaylistParameters = Partial<PlaylistParameters> &
  PlaylistIdObject;

export type ChangeDetailsForPlaylistResponse = Promise<Response<void>>;

export type CreatePlaylistParameters = PlaylistParameters & UserIdObject;

export type CreatePlaylistResponse = Promise<Response<PlaylistObject>>;

export type GetMyPlaylistsParameters = LimitOption & OffsetOption;

export type GetPlaylistsResponse = Promise<
  Response<PagingObject<SimplifiedPlaylistObject>>
>;

export type GetPlaylistsForUserParameters = LimitOption &
  OffsetOption &
  UserIdObject;

export type PlaylistItemType =
  | ['track']
  | ['episode']
  | ['track', 'episode']
  | ['episode', 'track'];

export interface GetPlaylistParameters<T>
  extends MarketOption,
    PlaylistIdObject {
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

export type GetCoverImageForPlaylistParameters = PlaylistIdObject;

export type GetCoverImageForPlaylistResponse = Promise<Response<ImageObject[]>>;

export type ListItemsInPlaylistParameters<T> = GetPlaylistParameters<T> &
  LimitOption &
  OffsetOption;

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

export type PlaylistTrackIdentifierObject = UriObject &
  Partial<PositionsObject>;

export interface RemoveItemsFromPlaylistParameters
  extends PlaylistIdObject,
    Partial<SnapshotIdObject> {
  /** An array of objects containing Spotify URIs
   * and optional positions of the tracks or episodes
   * to remove. */
  tracks: PlaylistTrackIdentifierObject[];
}

export type RemoveItemsFromPlaylistResponse = Promise<
  Response<SnapshotIdObject>
>;

export interface ReorderItemsInPlaylistParameters
  extends PlaylistIdObject,
    Partial<SnapshotIdObject> {
  /** The position of the first item to be reordered. */
  range_start: number;
  /** The position where the items should be inserted. */
  insert_before: number;
  /** The amount of items to be reordered. */
  range_length?: number;
}

export type ReorderItemsInPlaylistResponse = Promise<
  Response<SnapshotIdObject>
>;

export type ReplaceItemsInPlaylistParameters = PlaylistIdObject &
  Partial<UrisObject>;

export type ReplaceItemsInPlaylistResponse = Promise<Response<void>>;

export interface UploadCoverImageForPlaylistParameters
  extends PlaylistIdObject {
  /** Base64 encoded JPEG image data, maximum payload
   * size is 256 KB. */
  image: string;
}

export type UploadCoverImageForPlaylistResponse = Promise<Response<void>>;
