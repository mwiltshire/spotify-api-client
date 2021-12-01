import { DeviceType } from './common';

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#paging-object
 */
export interface PagingObject<T = any> {
  /** A link to the Web API endpoint returning the full result of the request. */
  href: string;
  /** The requested data. */
  items: T[];
  /** The maximum number of items in the response (as set in the query or
   * by default). */
  limit: number;
  /** URL to the next page of items. (null if none) */
  next: string | null;
  /** The offset of the items returned (as set in the query or by default). */
  offset: number;
  /**	URL to the previous page of items. (null if none) */
  previous: string | null;
  /** The maximum number of items available to return. */
  total: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/#cursor-based-paging-object
 */
export interface CursorBasedPagingObject<T = any> {
  /** A link to the Web API endpoint returning the full result of the request. */
  href: string;
  /** The requested data. */
  items: T[];
  /** The maximum number of items in the response (as set in the query or
   * by default). */
  limit: number;
  /** URL to the next page of items. (null if none) */
  next: string | null;
  /** The cursors used to find the next set of items. */
  cursors: CursorObject;
  /** The total number of items available to return. */
  total: number;
}

export interface CursorObject {
  /**	The cursor to use as key to find the next page of items. */
  after: string;
}

export interface ExplicitContentSettingsObject {
  /** When true, indicates that explicit content should not be played. */
  filter_enabled: boolean;
  /** When true, indicates that the explicit content setting is locked
   * and can’t be changed by the user.*/
  filter_locked: boolean;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#external-url-object
 */
export interface ExternalURLObject {
  /** The type of the URL */
  spotify: string;
  [k: string]: string;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#user-object-public
 */
export interface UserObjectPublic extends ContextObject {
  /** The name displayed on the user’s profile. null if not available. */
  display_name: string | null;
  /**	Information about the followers of this user. */
  followers: FollowersObject;
  /** The Spotify user ID for this user. */
  id: string;
  /** The user’s profile image. */
  images: ImageObject[];
  type: 'user';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#user-object-private
 */
export interface UserObjectPrivate extends ContextObject {
  /** The country of the user, as set in the user’s account profile.
   * An ISO 3166-1 alpha-2 country code. This field is only available
   * when the current user has granted access to the user-read-private
   * scope.*/
  country?: string;
  /** The name displayed on the user’s profile. null if not available. */
  display_name: string | null;
  /** The user’s email address, as entered by the user when creating
   * their account. This field is only available when the current user
   * has granted access to the user-read-email scope. */
  email?: string;
  /** The user’s explicit content settings. This field is only available
   * when the current user has granted access to the user-read-private scope. */
  explicit_content: ExplicitContentSettingsObject;
  /**	Information about the followers of this user. */
  followers: FollowersObject;
  /** The Spotify user ID for this user. */
  id: string;
  /** The user’s profile image. */
  images: ImageObject[];
  /** The user's Spotify subscription level: "premium", "free", etc.
   * The subscription level "open" can be considered the same as "free".
   * This field is only available when the current user has granted access
   * to the user-read-private scope. */
  product?: 'premium' | 'free' | 'open';
  type: 'user';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#followers-object
 */
export interface FollowersObject {
  /** A link to the Web API endpoint providing full details of the followers;
   * null if not available. Please note that this will always be set to null,
   * as the Web API does not support it at the moment. */
  href: null;
  /** The total number of followers. */
  total: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#image-object
 */
export interface ImageObject {
  /** The image height in pixels. If unknown: null or not returned. */
  height?: number | null;
  /** The source URL of the image. */
  url: string;
  /** The image width in pixels. If unknown: null or not returned. */
  width?: number | null;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#copyright-object
 */
export interface CopyrightObject {
  /** The copyright text for this album. */
  text: string;
  /** The type of copyright: C = the copyright, P = the sound
   * recording (performance) copyright. */
  type: 'C' | 'P';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#external-id-object
 */
export interface ExternalIDObject {
  /** The identifier type, for example 'isrc', 'ean' or 'upc' */
  [k: string]: string;
}

export interface RestrictionsObject {
  reason: string;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#track-link
 */
export interface LinkedTrackObject {
  /** Known external URLs for this track. */
  external_urls: ExternalURLObject;
  /** A link to the Web API endpoint providing full details of the track. */
  href: string;
  /**	The Spotify ID for the track. */
  id: string;
  /** The object type: “track”. */
  type: 'track';
  /** The Spotify URI for the track. */
  uri: string;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#resume-point-object
 */
export interface ResumePointObject {
  /** 	Whether or not the episode has been fully played by the user. */
  fully_played: boolean;
  /** The user’s most recent position in the episode in milliseconds. */
  resume_position_ms: number;
}

export interface ContextObject {
  /** The object type: 'artist', 'track', 'playlist', 'user', etc. */
  type: 'artist' | 'track' | 'playlist' | 'album' | 'show' | 'episode' | 'user';
  /** A link to the Web API endpoint providing full details of the context. */
  href: string;
  /** External URLs for this context. */
  external_urls: ExternalURLObject;
  /** The Spotify URI for the context. */
  uri: string;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#artist-object-simplified
 */
export interface SimplifiedArtistObject extends ContextObject {
  /** The Spotify ID for the artist. */
  id: string;
  /** The name of the artist. */
  name: string;
  /** The object type: “artist” */
  type: 'artist';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#artist-object-full
 */
export interface ArtistObject extends SimplifiedArtistObject {
  /** Information about the followers of the artist. */
  followers: FollowersObject;
  /** A list of the genres the artist is associated with. */
  genres: string[];
  /** Images of the artist in various sizes, widest first. */
  images: ImageObject[];
  /** The popularity of the artist. The value will be between 0 and 100,
   * with 100 being the most popular. */
  popularity: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-simplified
 */
export interface SimplifiedTrackObject extends ContextObject {
  /** The artists who performed the track. */
  artists: SimplifiedArtistObject[];
  /** A list of the countries in which the track can be played,
   * identified by theirISO 3166-1 alpha-2 code. */
  available_markets: string[];
  /** The disc number (usually 1 unless the album consists of
   * more than one disc). */
  disc_number: number;
  /** The track length in milliseconds. */
  duration_ms: number;
  /** Whether or not the track has explicit lyrics. */
  explicit: boolean;
  /**	The Spotify ID for the track. */
  id: string;
  /** Part of the response when Track Relinking is applied. If true,
   * the track is playable in the given market. Otherwise false. */
  is_playable: boolean;
  /** Part of the response when Track Relinking is applied and is only
   * part of the response if the track linking, in fact, exists.
   * The requested track has been replaced with a different track.
   * The track in the linked_from object contains information about
   * the originally requested track. */
  linked_from: LinkedTrackObject;
  /** Part of the response when Track Relinking is applied, the original
   * track is not available in the given market, and Spotify did not have
   * any tracks to relink it with. The track response will still contain
   * metadata for the original track, and a restrictions object containing
   * the reason why the track is not available */
  restrictions: RestrictionsObject;
  /** The name of the track. */
  name: string;
  /** A URL to a 30 second preview (MP3 format) of the track. */
  preview_url: string;
  /** The number of the track. If an album has several discs, the track
   * number is the number on the specified disc. */
  track_number: number;
  /** Whether or not the track is from a local file. */
  is_local: boolean;
  /** The object type: “track” */
  type: 'track';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#track-object-full
 */
export interface TrackObject extends SimplifiedTrackObject {
  /** The album on which the track appears. */
  album: SimplifiedAlbumObject;
  /**	Known external IDs for the track. */
  external_ids: ExternalIDObject;
  /** The popularity of the track. The value will be between 0 and 100,
   * with 100 being the most popular. The popularity of a track is a
   * value between 0 and 100, with 100 being the most popular. */
  popularity: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#album-object-simplified
 */
export interface SimplifiedAlbumObject extends ContextObject {
  /** The field is present when getting an artist’s albums. Compared to
   * album_type this field represents relationship between the artist
   * and the album. */
  album_group?: 'album' | 'single' | 'compilation' | 'appears_on';
  /** The type of the album: one of “album”, “single”, or “compilation”. */
  album_type: 'album' | 'single' | 'compliation';
  /** The artists of the album. */
  artists: SimplifiedArtistObject[];
  /** The markets in which the album is available: ISO 3166-1 alpha-2
   * country codes. */
  available_markets: string[];
  /** Known external URLs for this album. */
  external_urls: ExternalURLObject;
  /** A link to the Web API endpoint providing full details of the album. */
  href: string;
  /** The Spotify ID for the album. */
  id: string;
  /** The cover art for the album in various sizes, widest first. */
  images: ImageObject[];
  /** The name of the album. In case of an album takedown, the value may
   * be an empty string.*/
  name: string;
  /** The date the album was first released, for example 1981. Depending on
   * the precision, it might be shown as 1981-12 or 1981-12-15. */
  release_date: string;
  /** The precision with which release_date value is known: year,
   * month, or day. */
  release_date_precision: 'year' | 'month' | 'day';
  /** Part of the response when Track Relinking is applied, the original
   * track is not available in the given market, and Spotify did not have
   * any tracks to relink it with. The track response will still contain
   * metadata for the original track, and a restrictions object containing
   * the reason why the track is not available */
  restrictions: RestrictionsObject;
  /** The object type: “album” */
  type: 'album';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#album-object-full
 */
export interface AlbumObject extends SimplifiedAlbumObject {
  /** The copyright statements of the album. */
  copyrights: CopyrightObject[];
  /** Known external IDs for the album. */
  external_ids: ExternalIDObject[];
  /** A list of the genres used to classify the album. */
  genres: string[];
  /** The label for the album. */
  label: string;
  /** The popularity of the album. The value will be between 0 and 100,
   * with 100 being the most popular. */
  popularity: number;
  /** The tracks of the album. */
  tracks: SimplifiedTrackObject[];
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#show-object-simplified
 */
export interface SimplifiedShowObject extends ContextObject {
  /** A list of the countries in which the show can be played,
   * identified by their ISO 3166-1 alpha-2 code. */
  available_markets: string[];
  /** The copyright statements of the show. */
  copyrights: CopyrightObject[];
  /** A description of the show. */
  description: string;
  /**	Whether or not the show has explicit content. */
  explicit: boolean;
  /** The Spotify ID for the show. */
  id: string;
  /** The cover art for the show in various sizes, widest first. */
  images: ImageObject[];
  /** True if all of the show’s episodes are hosted outside of Spotify’s CDN.
   * This field might be null in some cases. */
  is_externally_hosted: boolean | null;
  /** A list of the languages used in the show, identified by their ISO 639 code. */
  languages: string[];
  /** The media type of the show. */
  media_type: string;
  /** The name of the show. */
  name: string;
  /** The publisher of the show. */
  publisher: string;
  /**	The object type: “show”. */
  type: 'show';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#show-object-full
 */
export interface ShowObject extends SimplifiedShowObject {
  /** A list of the show’s episodes. */
  episodes: PagingObject<SimplifiedEpisodeObject>;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#episode-object-simplified
 */
export interface SimplifiedEpisodeObject {
  /** A URL to a 30 second preview (MP3 format) of the episode. null if not available. */
  audio_preview_url: string | null;
  /** A description of the episode. */
  description: string;
  /** The episode length in milliseconds. */
  duration_ms: number;
  /** Whether or not the episode has explicit content. */
  explicit: boolean;
  /** The Spotify ID for the episode. */
  id: string;
  /** The cover art for the episode in various sizes, widest first. */
  images: ImageObject[];
  /** True if the episode is hosted outside of Spotify’s CDN. */
  is_externally_hosted: boolean;
  /** True if the episode is playable in the given market. Otherwise false. */
  is_playable: boolean;
  /** Note: This field is deprecated and might be removed in the future.
   * Please use the languages field instead. The language used in the
   * episode, identified by a ISO 639 code. */
  language?: string;
  /** A list of the languages used in the episode, identified by their ISO 639 code. */
  languages: string[];
  /** The name of the episode. */
  name: string;
  /** The date the episode was first released, for example "1981-12-15".
   * Depending on the precision, it might be shown as "1981" or "1981-12". */
  release_date: string;
  /** The precision with which release_date value is known: year,
   * month, or day. */
  release_date_precision: 'year' | 'month' | 'day';
  /** The user’s most recent position in the episode. Set if the supplied
   * access token is a user token and has the scope user-read-playback-position. */
  resume_point?: ResumePointObject;
  /** The object type: "episode". */
  type: 'episode';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#episode-object-full
 */
export interface EpisodeObject extends SimplifiedEpisodeObject {
  /** The show to which the episode belongs. */
  show: SimplifiedShowObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#playlist-track-object
 */
export interface PlaylistTrackObject<T = TrackObject | EpisodeObject> {
  /** The date and time the track or episode was added. Note that some very old
   * playlists may return null in this field. */
  added_at: string | null;
  /** The Spotify user who added the track or episode. Note that some very old
   * playlists may return null in this field. */
  added_by: UserObjectPublic | null;
  /** Whether this track or episode is a local file or not. */
  is_local: boolean;
  /** Information about the track or episode. */
  track: T;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#playlist-object-simplified
 */
export interface SimplifiedPlaylistObject<T = TrackObject | EpisodeObject>
  extends ContextObject {
  /** Returns true if context is not search and the owner allows other users to modify
   * the playlist. Otherwise returns false. */
  collaborative: boolean;
  /** The playlist description. Only returned for modified, verified playlists,
   * otherwise null. */
  description: string | null;
  /** The Spotify ID for the playlist. */
  id: string;
  /** Images for the playlist. */
  images: ImageObject[];
  /** The name of the playlist. */
  name: string;
  /** The user who owns the playlist */
  owner: UserObjectPublic;
  /** The playlist’s public/private status: true the playlist is public, false the
   * playlist is private, null the playlist status is not relevant.  */
  public: boolean | null;
  /** The version identifier for the current playlist. Can be supplied in other
   * requests to target a specific playlist version */
  snapshot_id: string;
  /** Information about the tracks of the playlist. */
  tracks: PagingObject<PlaylistTrackObject<T>>;
  type: 'playlist';
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#playlist-object-full
 */
export interface PlaylistObject<T = TrackObject | EpisodeObject>
  extends SimplifiedPlaylistObject<T> {
  /** Information about the followers of the playlist. */
  followers: FollowersObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/get-a-users-available-devices/
 */
export interface DeviceObject {
  /** The device ID. This may be null. */
  id: string | null;
  /** If this device is the currently active device. */
  is_active: boolean;
  /** If this device is currently in a private session. */
  is_private_session: boolean;
  /** Whether controlling this device is restricted.
   * At present if this is “true” then no Web API commands
   * will be accepted by this device. */
  is_restricted: boolean;
  /** The name of the device. */
  name: string;
  /** Device type, such as “Computer”, “Smartphone” or “Speaker”. */
  type: DeviceType;
  /** The current volume in percent. This may be null. */
  volume_percent: number | null;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#disallows-object
 */
export interface DisallowsObject {
  interrupting_playback?: boolean;
  pausing?: boolean;
  resuming?: boolean;
  seeking?: boolean;
  skipping_next?: boolean;
  skipping_prev?: boolean;
  toggling_repeat_context?: boolean;
  toggling_shuffle?: boolean;
  toggling_repeat_track?: boolean;
  transferring_playback?: boolean;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/get-recently-played/#play-history-object
 */
export interface PlayHistoryObject {
  /** The track the user listened to. */
  track: SimplifiedTrackObject;
  /** The date and time the track was played in ISO 8601 format as
   * Coordinated Universal Time (UTC) with a zero offset:
   * YYYY-MM-DDTHH:MM:SSZ. */
  played_at: string;
  /** The context the track was played from. */
  context: ContextObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/player/get-the-users-currently-playing-track/#currently-playing-object
 */
export interface CurrentlyPlayingObject<T = TrackObject | EpisodeObject> {
  /** A Context Object. Can be null (e.g. If private session is
   * enabled this will be null). */
  context: ContextObject | null;
  /** Unix Millisecond Timestamp when data was fetched */
  timestamp: number;
  /** Progress into the currently playing track. Can be null
   * (e.g. If private session is enabled this will be null). */
  progress_ms: number | null;
  /** If something is currently playing. */
  is_playing: boolean;
  /** The currently playing track or episode. Can be null
   * (e.g. If private session is enabled this will be null). */
  item: T | null;
  /** The object type of the currently playing item. Can be one
   * of 'track', 'episode', 'ad' or 'unknown'. */
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  /** Allows to update the user interface based on which playback
   * actions are available within the current context. */
  actions: {
    disallows: DisallowsObject;
  };
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#category-object
 */
export interface CategoryObject {
  /** A link to the Web API endpoint returning full details
   * of the category. */
  href: string;
  /** The category icon, in various sizes. */
  icons: ImageObject[];
  /** The Spotify category ID of the category. */
  id: string;
  /** The name of the category. */
  name: string;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#recommendations-seed-object
 */
export interface RecommendationsSeedObject {
  /** The number of tracks available after min_* and max_*
   * filters have been applied. */
  afterFilteringSize: number;
  /** The number of tracks available after relinking for
   * regional availability. */
  afterRelinkingSize: number;
  /** A link to the full track or artist data for this seed.
   * For genre seeds, this value will be null.
   */
  href: string | null;
  /**	The id used to select this seed. */
  id: string;
  /** The number of recommended tracks available for this seed. */
  initialPoolSize: number;
  /** The entity type of this seed. One of artist, track or genre. */
  type: 'artist' | 'track' | 'genre';
}

export interface RecommendationsObject {
  /** An array of recommendation seed objects. */
  seeds: RecommendationsSeedObject[];
  /** An array of simplified track objects. */
  tracks: SimplifiedTrackObject[];
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#saved-album-object
 */
export interface SavedAlbumObject {
  /** The date and time the album was saved. */
  added_at: string;
  /** Information about the album. */
  album: AlbumObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#saved-show-object
 */
export interface SavedShowObject {
  /** The date and time the show was saved. */
  added_at: string;
  /** Information about the show. */
  show: ShowObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#saved-track-object
 */
export interface SavedTrackObject {
  /** The date and time the track was saved. */
  added_at: string;
  /** Information about the track. */
  track: TrackObject;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/#time-interval-object
 */
export interface TimeIntervalObject {
  /** The starting point (in seconds) of the time interval. */
  start: number;
  /** The duration (in seconds) of the time interval. */
  duration: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the interval. */
  confidence: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/#section-object
 */
export interface SectionObject {
  /** The starting point (in seconds) of the section. */
  start: number;
  /**	The duration (in seconds) of the section. */
  duration: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the
   * section’s “designation”. */
  confidence: number;
  /** The overall loudness of the section in decibels (dB). */
  loudness: number;
  /** 	The overall estimated tempo of the section in beats per minute (BPM). */
  tempo: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the tempo. */
  tempo_confidence: number;
  /** The estimated overall key of the section. */
  key: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the key. */
  key_confidence: number;
  /** Indicates the modality (major or minor) of a track, the type of
   * scale from which its melodic content is derived. This field will
   * contain a 0 for “minor”, a 1 for “major”, or a -1 for no result. */
  mode: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the mode. */
  mode_confidence: number;
  /** An estimated overall time signature of a track. */
  time_signature: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the time_signature. */
  time_signature_confidence: number;
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/#segment-object
 */
export interface SegmentObject {
  /** The starting point (in seconds) of the segment. */
  start: number;
  /** The duration (in seconds) of the segment. */
  duration: number;
  /** The confidence, from 0.0 to 1.0, of the reliability of the segmentation. */
  confidence: number;
  /** The onset loudness of the segment in decibels (dB). */
  loudness_start: number;
  /** The peak loudness of the segment in decibels (dB). */
  loudness_max: number;
  /** The segment-relative offset of the segment peak loudness in seconds. */
  loudness_max_time: number;
  /**	The offset loudness of the segment in decibels (dB).  */
  loudness_end: number;
  /** A “chroma” vector representing the pitch content of the segment,
   * corresponding to the 12 pitch classes C, C#, D to B, with values
   * ranging from 0 to 1 that describe the relative dominance of every
   * pitch in the chromatic scale. */
  pitches: number[];
  /** Timbre is the quality of a musical note or sound that distinguishes
   * different types of musical instruments, or voices. */
  timbre: number[];
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/tracks/get-audio-analysis/#audio-analysis-object
 */
export interface AudioAnalysisObject {
  /** The time intervals of the bars throughout the track. */
  bars: TimeIntervalObject[];
  /** The time intervals of beats throughout the track. */
  beats: TimeIntervalObject[];
  /** Sections are defined by large variations in rhythm
   * or timbre, e.g. chorus, verse, bridge, guitar solo, etc. */
  sections: SectionObject[];
  /** Audio segments attempts to subdivide a song into many
   * segments, with each segment containing a roughly consistent
   * sound throughout its duration. */
  segments: SegmentObject[];
  /** A tatum represents the lowest regular pulse train that a
   * listener intuitively infers from the timing of perceived
   * musical events (segments). */
  tatums: TimeIntervalObject[];
}

/**
 * https://developer.spotify.com/documentation/web-api/reference/object-model/#audio-features-object
 */
export interface AudioFeaturesObject {
  /** A confidence measure from 0.0 to 1.0 of whether the track
   * is acoustic. */
  acousticness: number;
  /** An HTTP URL to access the full audio analysis of this track. */
  analysis_url: string;
  /** Danceability describes how suitable a track is for dancing
   * based on a combination of musical elements including tempo,
   * rhythm stability, beat strength, and overall regularity.
   * A value of 0.0 is least danceable and 1.0 is most danceable. */
  danceability: number;
  /** The duration of the track in milliseconds. */
  duration_ms: number;
  /** Energy is a measure from 0.0 to 1.0 and represents a perceptual
   * measure of intensity and activity. */
  energy: number;
  /** The Spotify ID for the track. */
  id: string;
  /** Predicts whether a track contains no vocals. */
  instrumentalness: number;
  /** The key the track is in. */
  key: number;
  /** Detects the presence of an audience in the recording. */
  liveness: number;
  /** The overall loudness of a track in decibels (dB).  */
  loudness: number;
  /** Mode indicates the modality (major or minor) of a track, the type
   * of scale from which its melodic content is derived. Major is
   * represented by 1 and minor is 0. */
  mode: number;
  /** Speechiness detects the presence of spoken words in a track. */
  speechiness: number;
  /** The overall estimated tempo of a track in beats per minute (BPM). */
  tempo: number;
  /** An estimated overall time signature of a track. */
  time_signature: number;
  /** A link to the Web API endpoint providing full details of the track. */
  track_href: string;
  /** The object type: “audio_features” */
  type: 'audio_features';
  /** The Spotify URI for the track. */
  uri: string;
  /** A measure from 0.0 to 1.0 describing the musical positiveness
   * conveyed by a track.  */
  valence: number;
}

export interface Albums {
  albums: AlbumObject[];
}

export interface NullableAlbums {
  albums: Array<AlbumObject | null>;
}

export interface Tracks {
  tracks: TrackObject[];
}

export interface NullableTracks {
  tracks: Array<TrackObject | null>;
}

export interface Artists {
  artists: ArtistObject[];
}

export interface NullableArtists {
  albums: Array<ArtistObject | null>;
}

export interface NullableEpisodes {
  albums: Array<EpisodeObject | null>;
}

export interface NullableSimplifiedShows {
  shows: Array<SimplifiedShowObject | null>;
}

export interface NullableAudioFeatures {
  audio_features: Array<SimplifiedShowObject | null>;
}

export interface IdObject {
  id: string;
}

export interface IdsObject {
  ids: string[];
}

export interface CategoryIdObject {
  category_id: string;
}

export interface PagingCategoriesObject {
  categories: PagingObject<CategoryObject>;
}

export interface MessageObject {
  message: string;
}

export interface PagingSimplifiedAlbumsObject {
  albums: PagingObject<SimplifiedAlbumObject>;
}

export interface PagingArtistsObject {
  artists: PagingObject<ArtistObject>;
}

export interface PagingTracksObject {
  tracks: PagingObject<TrackObject>;
}

export interface PagingSimplifiedShowsObject {
  shows: PagingObject<SimplifiedShowObject>;
}

export interface PagingSimplifiedEpisodesObject {
  episodes: PagingObject<SimplifiedEpisodeObject>;
}

export interface PagingSimplifiedPlaylistsObject {
  playlists: PagingObject<SimplifiedPlaylistObject>;
}

export interface GenresObject {
  genres: string[];
}

export interface PlaylistIdObject {
  playlist_id: string;
}

export interface CursorBasedPagingArtistsObject {
  artists: CursorBasedPagingObject<ArtistObject>;
}

export interface DevicesObject {
  devices: DeviceObject[];
}

export interface SnapshotIdObject {
  snapshot_id: string;
}

export interface UserIdObject {
  user_id: string;
}

export interface UriObject {
  uri: string;
}

export interface UrisObject {
  uris: string[];
}

export interface DeviceIdObject {
  device_id: string;
}

export interface DeviceIdsObject {
  device_ids: string[];
}

export interface PositionObject {
  position: number;
}

export interface PositionsObject {
  positions: number[];
}
