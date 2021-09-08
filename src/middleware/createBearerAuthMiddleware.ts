import { BearerAuthMiddlewareConfig } from './types';
import { Fetcher, RequestConfig } from '../types';

export function createBearerAuthMiddleware({
  token
}: BearerAuthMiddlewareConfig) {
  return (next: Fetcher) => async (request: RequestConfig) => {
    // `scheme` may be undefined, e.g. if this is a request
    // for access token using PKCE flow.
    if (!request.scheme || request.scheme !== 'Bearer') {
      return next(request);
    }

    // Bail if the Authorization field is already present in the
    // headers for any reason.
    if (request.headers?.['Authorization'] || request.headers?.authorization) {
      return next(request);
    }

    const accessToken = typeof token === 'function' ? await token() : token;

    return next({
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${accessToken}`
      }
    });
  };
}
