import { Fetcher, RequestConfig, MaybePromise } from '../types';

export type Middleware = (
  next: Fetcher
) => MaybePromise<(request: RequestConfig) => ReturnType<Fetcher>>;

export interface BasicAuthMiddlewareConfig {
  client_id: string;
  client_secret: string;
}

export interface BearerAuthMiddlewareConfig {
  token: string | (() => MaybePromise<string>);
}

export type AuthMiddlewareConfig = BasicAuthMiddlewareConfig &
  BearerAuthMiddlewareConfig;
