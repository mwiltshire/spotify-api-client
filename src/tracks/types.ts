import {
  Response,
  MarketOption,
  AudioAnalysisObject,
  AudioFeaturesObject,
  NullableAudioFeatures,
  NullableTracks,
  TrackObject
} from '../types';

export interface TrackIdParameter {
  /** The Spotify ID for the track. */
  id: string;
}

export interface TrackIdsParameter {
  /** Array of Spotify track IDs. Maximum: 100 IDs. */
  ids: string[];
}

export type GetAudioAnalysisForTrackParameters = TrackIdParameter;

export type GetAudioAnalysisForTrackResponse = Promise<
  Response<AudioAnalysisObject>
>;

export type GetAudioFeaturesForTrackParameters = TrackIdParameter;

export type GetAudioFeaturesForTrackResponse = Promise<
  Response<AudioFeaturesObject>
>;

export type GetAudioFeaturesForTracksParameters = TrackIdsParameter;

export type GetAudioFeaturesForTracksResponse = Promise<
  Response<NullableAudioFeatures>
>;

export interface GetTracksParameters extends MarketOption, TrackIdsParameter {}

export type GetTracksResponse = Promise<Response<NullableTracks>>;

export interface GetTrackParameters extends MarketOption, TrackIdParameter {}

export type GetTrackResponse = Promise<Response<TrackObject>>;
