import { Fetcher, RequestConfig, FetcherEnhancer } from './types';

export function createClient(fetcher: Fetcher, middleware?: FetcherEnhancer) {
  return async (request: RequestConfig) => {
    if (middleware) {
      const withMiddleware = await middleware(fetcher);
      return withMiddleware(request);
    }
    return fetcher(request);
  };
}
