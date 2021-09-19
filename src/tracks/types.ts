import {
  Response,
  MarketOption,
  AudioAnalysisObject,
  AudioFeaturesObject,
  NullableAudioFeatures,
  NullableTracks,
  TrackObject,
  IdObject,
  IdsObject
} from '../types';

export type GetAudioAnalysisForTrackParameters = IdObject;

export type GetAudioAnalysisForTrackResponse = Promise<
  Response<AudioAnalysisObject>
>;

export type GetAudioFeaturesForTrackParameters = IdObject;

export type GetAudioFeaturesForTrackResponse = Promise<
  Response<AudioFeaturesObject>
>;

export type GetAudioFeaturesForTracksParameters = IdsObject;

export type GetAudioFeaturesForTracksResponse = Promise<
  Response<NullableAudioFeatures>
>;

export type GetTracksParameters = MarketOption & IdsObject;

export type GetTracksResponse = Promise<Response<NullableTracks>>;

export type GetTrackParameters = MarketOption & IdObject;

export type GetTrackResponse = Promise<Response<TrackObject>>;
