import { createClient } from '../client';
import { useMiddleware } from '../middleware/useMiddleware';
import { Fetcher, RequestConfig } from '../types';

describe('createClient', () => {
  test('fetcher is called with request object passed to client', async () => {
    const fetcher = jest.fn(() =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {} })
    );

    const client = createClient(fetcher);

    await client({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });
  });

  test('fetcher is called with request object passed to client and chained through middleware', async () => {
    const fetcher = jest.fn(() =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {} })
    );

    const middleware = (next: Fetcher) => (request: RequestConfig) => {
      return next({
        ...request,
        headers: {
          ...request.headers,
          Authorization: 'Bearer 1234'
        }
      });
    };

    const client = createClient(fetcher, useMiddleware(middleware));

    await client({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer',
      headers: {
        Authorization: 'Bearer 1234'
      }
    });
  });

  test('synchronous enhancer function replaces middleware', async () => {
    const fetcher = jest.fn(() =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {} })
    );

    const enhancer = (fetcher: Fetcher) => {
      const enhancedFetcher = (request: RequestConfig) => {
        return fetcher({
          ...request,
          headers: {
            ...request.headers,
            Authorization: 'Bearer 1234'
          }
        });
      };

      return enhancedFetcher;
    };

    const client = createClient(fetcher, enhancer);

    await client({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer',
      headers: {
        Authorization: 'Bearer 1234'
      }
    });
  });

  test('async enhancer function replaces middleware', async () => {
    const fetcher = jest.fn(() =>
      Promise.resolve({ body: 'SUCCESS', status: 200, headers: {} })
    );

    const getTestToken = async () => {
      return Promise.resolve('1234');
    };

    const enhancer = (fetcher: Fetcher) => {
      const enhancedFetcher = async (request: RequestConfig) => {
        const token = await getTestToken();
        return fetcher({
          ...request,
          headers: {
            ...request.headers,
            Authorization: `Bearer ${token}`
          }
        });
      };

      return enhancedFetcher;
    };

    const client = createClient(fetcher, enhancer);

    await client({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer',
      headers: {
        Authorization: 'Bearer 1234'
      }
    });
  });
});
