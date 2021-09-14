import { paginate } from './paginate';
import { Fetcher, Response, UnpackResponse } from '../types';
import { PaginateOptions } from './types';

export function gather<
  T extends (
    client: Fetcher,
    params?: any
  ) => Promise<Response<UnpackResponse<ReturnType<T>>>>,
  U extends (body: UnpackResponse<ReturnType<T>>) => any
>(client: T, check: U, options?: PaginateOptions) {
  return async function (...args: Parameters<T>) {
    const result: Array<
      ReturnType<U> extends Array<infer U> ? U : ReturnType<U>
    > = [];

    const pages = paginate(client, options)(...args);

    for await (const page of pages) {
      const toPush = check(page);
      result.push(...(Array.isArray(toPush) ? toPush : toPush));
    }

    return result;
  };
}
