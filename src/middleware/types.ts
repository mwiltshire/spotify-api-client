import { Fetcher, RequestConfig, MaybePromise } from '../types';

export type FetcherEnhancer = (fetcher: Fetcher) => MaybePromise<Fetcher>;

export type Middleware = (
  next: Fetcher
) => (request: RequestConfig) => ReturnType<Fetcher>;

export interface BasicAuthMiddlewareConfig {
  client_id: string;
  client_secret: string;
}

export interface BearerAuthMiddlewareConfig {
  token: string | (() => MaybePromise<string>);
}

export type AuthMiddlewareConfig = BasicAuthMiddlewareConfig &
  BearerAuthMiddlewareConfig;
