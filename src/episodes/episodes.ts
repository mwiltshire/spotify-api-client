import { formatPathParams } from '../utils';
import { get } from '../http/request';
import * as ENDPOINTS from './endpoints';
import {
  GetEpisodeParameters,
  GetEpisodesParameters,
  GetEpisodeResponse,
  GetEpisodesResponse
} from './types';
import { Fetcher } from '../types';

export function getEpisode(
  client: Fetcher,
  parameters: GetEpisodeParameters
): GetEpisodeResponse {
  const { id, ...rest } = parameters;
  const url = formatPathParams({ url: ENDPOINTS.EPISODE, parameters: { id } });
  return client(get({ url, params: rest }));
}

export function getEpisodes(
  client: Fetcher,
  parameters: GetEpisodesParameters
): GetEpisodesResponse {
  return client(get({ url: ENDPOINTS.EPISODES, params: parameters }));
}
