import { RequestConfig } from './http';
import { Fetcher, MaybePromise } from './common';

export type FetcherEnhancer = (fetcher: Fetcher) => MaybePromise<Fetcher>;

export type Middleware = (
  next: Fetcher
) => (request: RequestConfig) => ReturnType<Fetcher>;

export interface AuthMiddlewareConfig {
  token?: string | (() => MaybePromise<string>);
  clientId?: string;
  clientSecret?: string;
}
