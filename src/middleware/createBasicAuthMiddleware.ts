import { BasicAuthMiddlewareConfig } from './types';
import { Fetcher, RequestConfig } from '../types';

export function createBasicAuthMiddleware({
  client_id,
  client_secret
}: BasicAuthMiddlewareConfig) {
  return (next: Fetcher) => async (request: RequestConfig) => {
    // `scheme` may be undefined, e.g. if this is a request
    // for access token using PKCE flow.
    if (!request.scheme || request.scheme !== 'Basic') {
      return next(request);
    }

    // Bail if the Authorization field is already present in the
    // headers for any reason.
    if (request.headers?.['Authorization'] || request.headers?.authorization) {
      return next(request);
    }

    const codes = `${client_id}:${client_secret}`;
    const base64EncodedAuth =
      typeof window === 'undefined'
        ? Buffer.from(codes).toString('base64')
        : window.btoa(codes);

    return next({
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Basic ${base64EncodedAuth}`
      }
    });
  };
}
