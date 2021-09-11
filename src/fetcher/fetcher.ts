import { RequestConfig, Response as SpotifyResponse } from '../types';
import { stringifyEntries } from '../utils';

function prepareSearchParams(params: Record<string, any>) {
  return stringifyEntries(Object.entries(params));
}

function getError(body: any, response: Response) {
  const isApiError = typeof body?.error === 'object';
  const isAuthenticationError = typeof body?.error === 'string';

  let reason: string | undefined;
  let message: string;

  if (isApiError) {
    reason = body.error?.reason;
    message = body.error?.message;
  } else if (isAuthenticationError) {
    message = body?.error;
  } else {
    // Some other unhandled/unkown error most likely not
    // originating from Spotify.
    message = '[spotify api client] unknown error';
  }

  return {
    message,
    reason,
    status: response.status,
    response
  };
}

export async function fetcher(
  request: RequestConfig
): Promise<SpotifyResponse> {
  const { url, method, headers, params, body, signal } = request;
  let requestUrl = url;
  const init: RequestInit = { method, signal };

  if (headers) {
    init.headers = headers;
  }

  if (params) {
    const preparedParams = prepareSearchParams(params);
    const searchParams = new URLSearchParams(preparedParams);
    requestUrl = `${requestUrl}?${searchParams.toString()}`;
  }

  if (body) {
    init.body = body;
  }

  let response: Response;
  let json: any;

  try {
    response = await fetch(requestUrl, init);
    json = await response.json();
  } catch (error) {
    // Just rethrow any network-related errors, AbortError etc.
    throw error;
  }

  if (!response.ok) {
    const error = getError(json, response);
    throw error;
  }

  return {
    body: json,
    status: response.status,
    headers: response.headers,
    request
  };
}
