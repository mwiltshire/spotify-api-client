import { Fetcher, RequestConfig } from './types';
import { Middleware } from './middleware';

export function createClient(fetcher: Fetcher, middleware?: Middleware) {
  return async (request: RequestConfig) => {
    if (middleware) {
      const withMiddleware = await middleware(fetcher);
      return withMiddleware(request);
    }
    return fetcher(request);
  };
}
