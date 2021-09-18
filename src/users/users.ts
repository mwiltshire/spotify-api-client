import * as ENDPOINTS from './endpoints';
import { get } from '../http/request';
import { formatPathParams } from '../utils';
import { MeResponse, GetUserParameters, GetUserResponse } from './types';
import { Fetcher } from '../types';

export function me(client: Fetcher): MeResponse {
  return client(get({ url: ENDPOINTS.ME }));
}

export function getUser(
  client: Fetcher,
  parameters: GetUserParameters
): GetUserResponse {
  const { user_id } = parameters;
  const url = formatPathParams({
    url: ENDPOINTS.USER,
    parameters: { user_id: encodeURIComponent(user_id) }
  });
  return client(get({ url }));
}
