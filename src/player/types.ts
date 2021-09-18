import {
  Response,
  DeviceObject,
  CurrentlyPlayingObject,
  CursorBasedPagingObject,
  PlayHistoryObject,
  TrackObject,
  EpisodeObject,
  LimitOption,
  MarketOption,
  DeviceIdOption
} from '../types';

export type RepeatState = 'track' | 'context' | 'off';

export interface AddToPlaybackQueueParameters {
  /** The uri of the item to add to the queue. */
  uri: string;
  /** The id of the device this command is targeting. */
  device_id?: string;
}

export type AddToPlaybackQueueResponse = Promise<Response<void>>;

export interface AvailableDevices {
  /** A list of 0..n device objects */
  devices: DeviceObject[];
}

export type GetAvailableDevicesResponse = Promise<Response<AvailableDevices>>;

export interface GetCurrentPlaybackContextParameters extends MarketOption {
  /** Array of item types that your client supports besides the
   * default track type. Valid types are: 'track' and 'episode'. */
  additional_types?: ('track' | 'episode')[];
}

export interface CurrentPlaybackContext extends CurrentlyPlayingObject {
  /** The device that is currently active */
  device: DeviceObject;
  /** One of 'off', 'track' or 'context'. */
  repeat_state: RepeatState;
  /** If shuffle is on or off. */
  shuffle_state: boolean;
}

export type GetCurrentPlaybackContextResponse = Promise<
  Response<CurrentPlaybackContext>
>;

export interface GetRecentlyPlayedTracksParameters extends LimitOption {
  /** A Unix timestamp in milliseconds. Returns all items after
   * (but not including) this cursor position. If after is specified,
   * before must not be specified. */
  after?: number;
  /** A Unix timestamp in milliseconds. Returns all items after
   * (but not including) this cursor position. If before is specified,
   * after must not be specified. */
  before?: number;
}

export type RecentlyPlayedTracks = CursorBasedPagingObject<PlayHistoryObject>;

export type GetRecentlyPlayedTracksResponse = Promise<
  Response<RecentlyPlayedTracks>
>;

export type CurrentlyPlayingTrackType =
  | ['track']
  | ['episode']
  | ['track', 'episode']
  | ['episode', 'track'];

export interface GetCurrentlyPlayingTrackParameters<T> extends MarketOption {
  /** Array of item types that your client supports besides the
   * default track type. Valid types are: 'track' and 'episode'. */
  additional_types?: T;
}

export type CurrentlyPlayingTrack<T> = CurrentlyPlayingObject<
  T extends undefined | ['track'] ? TrackObject : TrackObject | EpisodeObject
>;

export type GetCurrentlyPlayingTrackResponse<T> = Promise<
  Response<CurrentlyPlayingTrack<T>>
>;

export type PauseParameters = DeviceIdOption;

export type PauseResponse = Promise<Response<void>>;

export interface SeekParameters extends DeviceIdOption {
  /** The position in milliseconds to seek to. Must be a positive number.
   * Passing in a position that is greater than the length of the track
   * will cause the player to start playing the next song. */
  position_ms: number;
}

export type SeekResponse = Promise<Response<void>>;

export interface RepeatParameters extends DeviceIdOption {
  /** track, context or off. 'track' will repeat the current track.
   * 'context' will repeat the current context. 'off' will turn repeat off. */
  state: RepeatState;
}

export type RepeatResponse = Promise<Response<void>>;

export interface SetVolumeParameters extends DeviceIdOption {
  /** The volume to set. Must be a value from 0 to 100 inclusive. */
  volume_percent: number;
}

export type SetVolumeResponse = Promise<Response<void>>;

export type SkipTrackParameters = DeviceIdOption;

export type SkipTrackResponse = Promise<Response<void>>;

export interface PlayOffsetPosition {
  /** Zero based and can’t be negative */
  position: number;
}

export interface PlayOffsetUri {
  /** String representing the uri of the item to start at */
  uri: string;
}

export interface PlayParameters extends DeviceIdOption {
  /** Spotify URI of the context to play. Valid contexts are albums, artists,
   * playlists. Example: {"context_uri": "spotify:album:1Je1IMUlBXcx1Fz0WE7oPT"} */
  context_uri?: string;
  /** A JSON array of the Spotify track URIs to play. For example:
   * {"uris": ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"]} */
  uris?: string[];
  /** Indicates from where in the context playback should start. Only available
   * when context_uri corresponds to an album or playlist object, or when the
   * uris parameter is used. */
  offset?: PlayOffsetPosition | PlayOffsetUri;
  /** Indicates from what position to start playback. Must be a positive number.
   * Passing in a position that is greater than the length of the track will
   * cause the player to start playing the next song. */
  position_ms?: number;
}

export type PlayResponse = Promise<Response<void>>;

export interface ShuffleParameters extends DeviceIdOption {
  /** true: Shuffle user’s playback, false: Do not shuffle user’s playback. */
  state: boolean;
}

export type ShuffleResponse = Promise<Response<void>>;

export interface TransferPlaybackParameters {
  /** A JSON array containing the ID of the device on which playback
   * should be started/transferred. For example:{device_ids:["74ASZWbe4lXaubB36ztrGX"]}
   * Note: Although an array is accepted, only a single device_id
   * is currently supported. Supplying more than one will return
   * 400 Bad Request */
  device_ids: string[];
  /** true: ensure playback happens on new device.
   * false or not provided: keep the current playback state. */
  play?: boolean;
}

export type TransferPlaybackResponse = Promise<Response<void>>;
