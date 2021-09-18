export type PlayerErrorReason =
  /** The command requires a previous track, but there is none in the context. */
  | 'NO_PREV_TRACK'
  /** The command requires a next track, but there is none in the context. */
  | 'NO_NEXT_TRACK'
  /** The requested track does not exist. */
  | 'NO_SPECIFIC_TRACK'
  /** The command requires playback to not be paused. */
  | 'ALREADY_PAUSED'
  /** The command requires playback to be paused. */
  | 'NOT_PAUSED'
  /** The command requires playback on the local device. */
  | 'NOT_PLAYING_LOCALLY'
  /** The command requires that a track is currently playing. */
  | 'NOT_PLAYING_TRACK'
  /** The command requires that a context is currently playing. */
  | 'NOT_PLAYING_CONTEXT'
  /** The shuffle command cannot be applied on an endless context. */
  | 'ENDLESS_CONTEXT'
  /** The command could not be performed on the context. */
  | 'CONTEXT_DISALLOW'
  /** The track should not be restarted if the same track and context is already playing, and there is a resume point. */
  | 'ALREADY_PLAYING'
  /** The user is rate limited due to too frequent track play, also known as cat-on-the-keyboard spamming. */
  | 'RATE_LIMITED'
  /** The context cannot be remote-controlled. */
  | 'REMOTE_CONTROL_DISALLOW'
  /** Not possible to remote control the device. */
  | 'DEVICE_NOT_CONTROLLABLE'
  /** Not possible to remote control the device’s volume. */
  | 'VOLUME_CONTROL_DISALLOW'
  /** Requires an active device and the user has none. */
  | 'NO_ACTIVE_DEVICE'
  /** The request is prohibited for non-premium users. */
  | 'PREMIUM_REQUIRED'
  /** Certain actions are restricted because of unknown reasons. */
  | 'UNKNOWN';

export interface RegularErrorObject {
  status: number;
  message: string;
}

export interface RegularErrorResponse {
  error: RegularErrorObject;
}

export interface PlayerErrorObject extends RegularErrorObject {
  reason: PlayerErrorReason;
}

export interface PlayerErrorResponse {
  error: PlayerErrorObject;
}

export interface AuthenticationErrorResponse {
  error: string;
  // Unsure whether this is always present but it is
  // specified in the API docs.
  error_description?: string;
}

export interface BaseApiErrorParameters {
  message: string;
  status: number;
  response: Response;
}

export interface AuthenticationErrorParameters extends BaseApiErrorParameters {
  error_description?: string;
}

export interface RegularErrorParameters extends BaseApiErrorParameters {
  reason?: string;
}

export interface PlayerErrorParameters extends BaseApiErrorParameters {
  reason: PlayerErrorReason;
}
