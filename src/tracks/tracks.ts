import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import { formatPathParams } from '../utils';
import {
  GetAudioAnalysisForTrackParameters,
  GetAudioFeaturesForTrackParameters,
  GetAudioFeaturesForTracksParameters,
  GetTracksParameters,
  GetTrackParameters,
  GetAudioAnalysisForTrackResponse,
  GetAudioFeaturesForTrackResponse,
  GetAudioFeaturesForTracksResponse,
  GetTrackResponse,
  GetTracksResponse
} from './types';
import { Fetcher } from '../types';

export function getAudioAnalysisForTrack(
  client: Fetcher,
  parameters: GetAudioAnalysisForTrackParameters
): GetAudioAnalysisForTrackResponse {
  const { id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.AUDIO_ANALYSIS_FOR_TRACK,
    parameters: { id }
  });
  return client(get({ url }));
}

export function getAudioFeaturesForTrack(
  client: Fetcher,
  parameters: GetAudioFeaturesForTrackParameters
): GetAudioFeaturesForTrackResponse {
  const { id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.AUDIO_FEATURES_FOR_TRACK,
    parameters: { id }
  });
  return client(get({ url }));
}

export function getAudioFeaturesForTracks(
  client: Fetcher,
  parameters: GetAudioFeaturesForTracksParameters
): GetAudioFeaturesForTracksResponse {
  return client(
    get({
      url: ENDPOINTS.AUDIO_FEATURES,
      params: parameters
    })
  );
}

export function getTracks(
  client: Fetcher,
  parameters: GetTracksParameters
): GetTracksResponse {
  return client(
    get({
      url: ENDPOINTS.TRACKS,
      params: parameters
    })
  );
}

export function getTrack(
  client: Fetcher,
  parameters: GetTrackParameters
): GetTrackResponse {
  const { id, ...params } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.TRACK,
    parameters: { id }
  });
  return client(get({ url, params }));
}
