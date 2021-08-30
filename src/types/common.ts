import { RequestConfig, Response } from './http';

export type Fetcher = (request: RequestConfig) => Promise<Response<any>>;

export type MaybePromise<T> = T | Promise<T>;
