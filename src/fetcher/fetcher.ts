import { AuthenticationError, RegularError } from '../error';
import {
  AuthenticationErrorResponse,
  RegularErrorResponse,
  RequestConfig,
  Response as SpotifyResponse
} from '../types';
import { isPlainObject, stringifyEntries } from '../utils';

function prepareSearchParams(params: Record<string, any>) {
  return stringifyEntries(Object.entries(params));
}

function isRegularApiError(
  body: Record<string, any>
): body is RegularErrorResponse {
  return isPlainObject(body.error);
}

function isAuthenticationError(
  body: Record<string, any>
): body is AuthenticationErrorResponse {
  return typeof body.error === 'string';
}

function getError(body: Record<string, any>, response: Response) {
  const { status } = response;

  if (isRegularApiError(body)) {
    return new RegularError({
      message: body.error.message,
      reason: body.error.reason,
      status,
      response
    });
  } else if (isAuthenticationError(body)) {
    return new AuthenticationError({
      message: body.error,
      error_description: body.error_description,
      status,
      response
    });
  }

  // Some other unhandled/unkown error most likely not
  // originating from Spotify.
  return new Error('[spotify api client] unknown error');
}

export async function fetcher(
  request: RequestConfig
): Promise<SpotifyResponse> {
  const { url, method, headers, params, body, signal = null } = request;
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

  try {
    const response = await fetch(requestUrl, init);
    let json;

    // Don't try to parse 204 NO CONTENT response.
    if (response.status !== 204) {
      json = await response.json();
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
  } catch (error) {
    // Just rethrow error from try block or any
    // network-related errors, AbortError etc.
    throw error;
  }
}
