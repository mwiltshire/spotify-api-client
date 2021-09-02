import { get, post, put } from '../http/request';
import * as ENDPOINTS from './endpoints';
import {
  AddToPlaybackQueueParameters,
  AddToPlaybackQueueResponse,
  CurrentlyPlayingTrackType,
  GetAvailableDevicesResponse,
  GetCurrentlyPlayingTrackParameters,
  GetCurrentlyPlayingTrackResponse,
  GetCurrentPlaybackContextParameters,
  GetCurrentPlaybackContextResponse,
  GetRecentlyPlayedTracksParameters,
  GetRecentlyPlayedTracksResponse,
  PauseParameters,
  PauseResponse,
  PlayParameters,
  PlayResponse,
  RepeatParameters,
  RepeatResponse,
  SeekParameters,
  SeekResponse,
  SetVolumeParameters,
  SetVolumeResponse,
  ShuffleParameters,
  ShuffleResponse,
  SkipTrackParameters,
  SkipTrackResponse,
  TransferPlaybackParameters,
  TransferPlaybackResponse
} from './types';
import { Fetcher } from '../types';

export function addToPlaybackQueue(
  client: Fetcher,
  parameters: AddToPlaybackQueueParameters
): AddToPlaybackQueueResponse {
  return client(
    post({
      url: ENDPOINTS.QUEUE,
      params: { ...parameters }
    })
  );
}

export function getAvailableDevices(
  client: Fetcher
): GetAvailableDevicesResponse {
  return client(get({ url: ENDPOINTS.DEVICES }));
}

export function getCurrentPlaybackContext(
  client: Fetcher,
  parameters: GetCurrentPlaybackContextParameters = {}
): GetCurrentPlaybackContextResponse {
  return client(
    get({
      url: ENDPOINTS.PLAYER,
      params: { ...parameters }
    })
  );
}

export function getRecentlyPlayedTracks(
  client: Fetcher,
  parameters: GetRecentlyPlayedTracksParameters = {}
): GetRecentlyPlayedTracksResponse {
  return client(
    get({
      url: ENDPOINTS.RECENTLY_PLAYED,
      params: { ...parameters }
    })
  );
}

export function getCurrentlyPlayingTrack<
  T extends CurrentlyPlayingTrackType | undefined = undefined
>(
  client: Fetcher,
  parameters: GetCurrentlyPlayingTrackParameters<T> = {}
): GetCurrentlyPlayingTrackResponse<T> {
  return client(
    get({
      url: ENDPOINTS.CURRENTLY_PLAYING,
      params: { ...parameters }
    })
  );
}

export function pause(
  client: Fetcher,
  parameters: PauseParameters = {}
): PauseResponse {
  return client(
    put({
      url: ENDPOINTS.PAUSE,
      params: { ...parameters }
    })
  );
}

export function seek(
  client: Fetcher,
  parameters: SeekParameters
): SeekResponse {
  return client(
    put({
      url: ENDPOINTS.SEEK,
      params: { ...parameters }
    })
  );
}

export function repeat(
  client: Fetcher,
  parameters: RepeatParameters
): RepeatResponse {
  return client(
    put({
      url: ENDPOINTS.REPEAT,
      params: { ...parameters }
    })
  );
}

export function setVolume(
  client: Fetcher,
  parameters: SetVolumeParameters
): SetVolumeResponse {
  return client(
    put({
      url: ENDPOINTS.VOLUME,
      params: { ...parameters }
    })
  );
}

export function skipToNextTrack(
  client: Fetcher,
  parameters: SkipTrackParameters = {}
): SkipTrackResponse {
  return client(
    post({
      url: ENDPOINTS.NEXT,
      params: { ...parameters }
    })
  );
}

export function skipToPreviousTrack(
  client: Fetcher,
  parameters: SkipTrackParameters = {}
): SkipTrackResponse {
  return client(
    post({
      url: ENDPOINTS.PREVIOUS,
      params: { ...parameters }
    })
  );
}

export function play(
  client: Fetcher,
  { device_id, ...rest }: PlayParameters = {}
): PlayResponse {
  return client(
    put({
      url: ENDPOINTS.PLAY,
      params: { device_id },
      body: { ...rest }
    })
  );
}

export function shuffle(
  client: Fetcher,
  parameters: ShuffleParameters
): ShuffleResponse {
  return client(
    put({
      url: ENDPOINTS.SHUFFLE,
      params: { ...parameters }
    })
  );
}

export function transferPlayback(
  client: Fetcher,
  parameters: TransferPlaybackParameters
): TransferPlaybackResponse {
  return client(
    put({
      url: ENDPOINTS.PLAYER,
      params: { ...parameters }
    })
  );
}
