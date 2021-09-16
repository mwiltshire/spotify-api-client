import { setupServer } from 'msw/node';
import { createClient } from '../../src';
import { fetcher } from '../../src/fetcher';
import { composeMiddleware } from '../../src/middleware';
import { play } from '../../src/player';
import { getCategories } from '../../src/browse';
import { categoriesOffset0 } from '../../mocks/responses/categories';
import { categories } from '../../mocks/handlers/categories';
import { player } from '../../mocks/handlers/retry';
import { Fetcher, RequestConfig } from '../../src/types';

const server = setupServer(categories, player);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('adding middleware', () => {
  test('applying single middleware function', async () => {
    const mockLogger = jest.fn();

    const logRequest = (next: Fetcher) => (request: RequestConfig) => {
      mockLogger(`Handling request to ${request.url}`);
      return next(request);
    };

    const client = createClient(fetcher, logRequest);

    await getCategories(client);

    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith(
      'Handling request to https://api.spotify.com/v1/browse/categories'
    );
  });

  test('applying composed middleware', async () => {
    const mockLogger = jest.fn();

    const logRequest = (next: Fetcher) => (request: RequestConfig) => {
      mockLogger(`Handling request to ${request.url}`);
      return next(request);
    };

    const augmentConfig = (next: Fetcher) => (request: RequestConfig) => {
      return next({
        ...request,
        headers: {
          ...request.headers,
          CUSTOM_HEADER: 'CUSTOM_VALUE'
        }
      });
    };

    const client = createClient(
      fetcher,
      composeMiddleware(logRequest, augmentConfig)
    );

    const response = await getCategories(client);

    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenCalledWith(
      'Handling request to https://api.spotify.com/v1/browse/categories'
    );

    expect(response.request.headers).toHaveProperty(
      'CUSTOM_HEADER',
      'CUSTOM_VALUE'
    );

    expect(response.body).toStrictEqual(categoriesOffset0);
  });

  test('adding async middleware', async () => {
    const getToken = async () => Promise.resolve('1234');

    const customAddAuth = (next: Fetcher) => async (request: RequestConfig) => {
      const token = await getToken();
      return next({
        ...request,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${token}`
        }
      });
    };

    const client = createClient(fetcher, customAddAuth);

    const response = await getCategories(client);

    expect(response.request.headers).toHaveProperty(
      'Authorization',
      'Bearer 1234'
    );
  });

  test('retrying a failed request in middleware', async () => {
    const mockLogger1 = jest.fn();
    const mockLogger2 = jest.fn();

    const logBefore = (next: Fetcher) => (request: RequestConfig) => {
      mockLogger1(request.headers?.Authorization);
      return next(request);
    };

    const retryRequest = (next: Fetcher) => async (request: RequestConfig) => {
      try {
        const res = await next(request);
        return res;
      } catch (error) {
        return next({
          ...request,
          headers: {
            ...request.headers,
            Authorization: 'Bearer 1234'
          }
        });
      }
    };

    const logAfter = (next: Fetcher) => (request: RequestConfig) => {
      mockLogger2(request.headers?.Authorization);
      return next(request);
    };

    const client = createClient(
      fetcher,
      composeMiddleware(logBefore, retryRequest, logAfter)
    );

    await play(client);

    // `logBefore` will be called only once
    expect(mockLogger1).toHaveBeenNthCalledWith(1, undefined);
    // `logAfter` will be called the first time
    expect(mockLogger2).toHaveBeenNthCalledWith(1, undefined);
    // After the request fails, `retryRequest` will retry and
    // `trigger` the next middleware (`logAfter`) again.
    expect(mockLogger2).toHaveBeenNthCalledWith(2, 'Bearer 1234');
  });
});
