import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import { formatPathParams } from '../utils';
import {
  GetShowParameters,
  GetShowsParameters,
  GetEpisodesForShowResponse,
  GetEpisodesForShowParameters,
  GetShowResponse,
  GetShowsResponse
} from './types';
import { Fetcher } from '../types';

export function getShow(
  client: Fetcher,
  parameters: GetShowParameters
): GetShowResponse {
  const { id, ...params } = parameters;
  const url = formatPathParams({ url: ENDPOINTS.SHOW, parameters: { id } });
  return client(get({ url, params }));
}

export function getShows(
  client: Fetcher,
  parameters: GetShowsParameters
): GetShowsResponse {
  return client(get({ url: ENDPOINTS.SHOWS, params: parameters }));
}

export function getEpisodesForShow(
  client: Fetcher,
  parameters: GetEpisodesForShowParameters
): GetEpisodesForShowResponse {
  const { id, ...params } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.EPISODES,
    parameters: { id }
  });
  return client(get({ url, params }));
}
