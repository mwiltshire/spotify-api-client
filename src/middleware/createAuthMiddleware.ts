import {
  AuthMiddlewareConfig,
  Fetcher,
  Middleware,
  RequestConfig
} from '../types';

export function createAuthMiddleware({
  token,
  clientId,
  clientSecret
}: AuthMiddlewareConfig): Middleware {
  return (next: Fetcher) => async (request: RequestConfig) => {
    // Scheme may be undefined here. When adding data during the
    // authorization code flow, the Basic scheme is expected.
    // However, if PKCE is requested we do not add any authorization
    // header as this flow does not make use of any secret.
    if (!request.scheme) {
      return next(request);
    }

    // Bail if the Authorization field is already present in the
    // headers for any reason.
    if (request.headers?.['Authorization'] || request.headers?.authorization) {
      return next(request);
    }

    let authorization: string;

    if (request.scheme === 'Bearer') {
      const accessToken = typeof token === 'function' ? await token() : token;
      authorization = `Bearer ${accessToken}`;
    } else {
      const codes = `${clientId}:${clientSecret}`;
      const base64EncodedAuth =
        typeof window === 'undefined'
          ? Buffer.from(codes).toString('base64')
          : window.btoa(codes);
      authorization = `Basic ${base64EncodedAuth}`;
    }

    return next({
      ...request,
      headers: {
        ...request.headers,
        Authorization: authorization
      }
    });
  };
}
