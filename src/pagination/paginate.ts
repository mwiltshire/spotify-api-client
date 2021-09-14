import { Fetcher, PagingObject, Response, UnpackResponse } from '../types';
import { isPlainObject } from '../utils';
import { PaginateOptions } from './types';

function hasFields(obj: Record<string, unknown>, fields: string[]) {
  return fields.every((field) => typeof obj[field] !== 'undefined');
}

function pickFields(
  obj: Record<string, unknown>,
  fields: string[]
): Record<string, unknown> {
  return fields.reduce((acc, curr) => {
    acc[curr] = obj[curr];
    return acc;
  }, {});
}

function findPaginationFields(
  obj: Record<string, unknown>
): Partial<PagingObject> {
  const paginationFields = ['limit', 'next', 'offset', 'previous', 'total'];

  // `next` might be at the top level of the object...
  if (hasFields(obj, paginationFields)) {
    return pickFields(obj, paginationFields);
  }

  // ...or it might be one level deeper e.g. `{categories: { next: '...' } }`
  const target = Object.values(obj).find((v) => {
    return isPlainObject(v) && hasFields(v, paginationFields);
  });

  return isPlainObject(target) ? pickFields(target, paginationFields) : {};
}

function getNextUrl(url: string, nextLimit: number) {
  const urlObject = new URL(url);
  urlObject.searchParams.set('limit', nextLimit.toString());
  return urlObject.toString();
}

function isUndefined(value: any): value is undefined {
  return typeof value === 'undefined';
}

function wait(duration: number) {
  return new Promise((res) => setTimeout(res, duration));
}

export function paginate<
  T extends (
    client: Fetcher,
    params?: any
  ) => Promise<Response<UnpackResponse<ReturnType<T>>>>
>(fn: T, options: PaginateOptions = {}) {
  return async function* (...args: Parameters<T>) {
    const {
      backoff = 0,
      maxItems = Number.POSITIVE_INFINITY,
      maxRequests = Number.POSITIVE_INFINITY
    } = options;

    const [client, params = {}] = args;

    const { limit: initialLimit } = pickFields(params, ['limit']);

    // The caller might set a `maxItems` value that is lower than the
    // `limit` option passed as a param to the endpoint function. If
    // this is the case, overwrite with `maxItems`, otherwise we'll
    // fetch more than desired on the first request.
    if (typeof initialLimit == 'number' && maxItems < initialLimit) {
      params.limit = maxItems;
    }

    let requestCount = 0;
    let handler = () => fn(client, params);

    while (requestCount < maxRequests) {
      requestCount++;

      if (requestCount !== 1) {
        await wait(backoff);
      }

      const { body } = await handler();

      yield body;

      const { next, limit, offset, total } = findPaginationFields(body);

      if (
        !next ||
        isUndefined(limit) ||
        isUndefined(offset) ||
        isUndefined(total)
      ) {
        return;
      }

      const nextLimit = Math.min(limit, maxItems - (limit + offset));

      if (nextLimit <= 0) {
        return;
      }

      const url = getNextUrl(next, nextLimit);
      handler = () => client({ url, method: 'GET' });
    }
  };
}
