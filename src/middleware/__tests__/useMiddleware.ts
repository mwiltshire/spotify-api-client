import { composeMiddleware } from '../composeMiddleware';
import { Fetcher, RequestConfig } from '../../types';

describe('composeMiddleware', () => {
  test('middleware fns are composed together so request can be passed through chain', async () => {
    const middleware1 = (next: Fetcher) => (request: RequestConfig) => {
      return next({
        ...request,
        headers: { Authorization: 'Bearer 123456789' }
      });
    };

    const middleware2 =
      // Middleware functions may be aynchronous...
      (next: Fetcher) => async (request: RequestConfig) => {
        await Promise.resolve();
        return next({
          ...request,
          params: { test: 123 }
        });
      };

    const fetcher = jest.fn((request) =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {}, request })
    );

    const middleware = composeMiddleware(middleware1, middleware2);

    const withMiddleware = await middleware(fetcher);

    const response = await withMiddleware({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(response.request).toStrictEqual({
      url: '/api',
      method: 'POST',
      body: 'test',
      headers: { Authorization: 'Bearer 123456789' },
      params: { test: 123 },
      scheme: 'Bearer'
    });
  });

  test('empty input applies no middleware', async () => {
    const fetcher = jest.fn((request) =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {}, request })
    );

    const middleware = composeMiddleware();

    const withMiddleware = await middleware(fetcher);

    const response = await withMiddleware({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(response.request).toStrictEqual({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });
  });

  test('request is aborted and error caught if middleware throws', async () => {
    const middleware1 = (next: Fetcher) => (request: RequestConfig) => {
      return next({
        ...request,
        headers: { Authorization: 'Bearer 123456789' }
      });
    };

    const middleware2 =
      // Middleware functions may be aynchronous...
      (next: Fetcher) => async (request: RequestConfig) => {
        // Just forcing an error to be thrown here...
        if (1 === 1) {
          throw new Error('Error!');
        }
        return next(request);
      };

    const fetcher = jest.fn((request) =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {}, request })
    );

    const middleware = composeMiddleware(middleware1, middleware2);

    const withMiddleware = await middleware(fetcher);

    try {
      await withMiddleware({
        url: '/api',
        method: 'POST',
        body: 'test',
        scheme: 'Bearer'
      });
    } catch (error) {
      expect(error.message).toBe('Error!');
      expect(fetcher).not.toHaveBeenCalledTimes(1);
    }
  });
});
