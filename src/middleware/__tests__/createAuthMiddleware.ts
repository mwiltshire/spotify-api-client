import { createAuthMiddleware } from '../createAuthMiddleware';
import { RequestConfig } from '../../types';

describe('auth', () => {
  it('calls fetcher with unmodified request config if no scheme field is present', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const request = {
      url: '/api',
      method: 'POST',
      body: 'test'
    } as const;

    await middleware(fetcher)(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(request);
  });

  it('calls fetcher with unmodified request config if auth header already present - lowercase', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const request = {
      url: '/api',
      method: 'POST',
      body: 'test',
      headers: {
        authorization: 'Bearer 1234'
      }
    } as const;

    await middleware(fetcher)(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(request);
  });

  it('calls fetcher with unmodified request config if auth header already present - uppercase', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const request = {
      url: '/api',
      method: 'POST',
      body: 'test',
      headers: {
        Authorization: 'Bearer 1234'
      }
    } as const;

    await middleware(fetcher)(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(request);
  });

  it('adds the correct Bearer authorization header', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const request = {
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    } as const;

    await middleware(fetcher)(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      ...request,
      headers: { Authorization: 'Bearer bjd873indk' }
    });
  });

  it('adds the correct Bearer authorization header asynchronously', async () => {
    const middleware = createAuthMiddleware({
      token: () => Promise.resolve('bjd873indk'),
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const request = {
      url: '/api',
      method: 'POST',
      body: 'test',
      scheme: 'Bearer'
    } as const;

    await middleware(fetcher)(request);

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      ...request,
      headers: { Authorization: 'Bearer bjd873indk' }
    });
  });

  it('uses client ID and secret to apply Basic authorization header in Node env', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const bufferToString = jest.fn(() => '12345678');
    const bufferFrom = jest.fn(() => ({ toString: bufferToString }));

    const originalBuffer = global.Buffer;
    global.Buffer = {
      // @ts-expect-error Mocking out Buffer.from(...).toString(...) calls
      from: bufferFrom
    };

    const request = {
      url: '/auth',
      method: 'POST',
      body: 'test',
      scheme: 'Basic'
    } as const;

    await middleware(fetcher)(request);

    expect(bufferFrom).toHaveBeenCalledTimes(1);
    expect(bufferFrom).toHaveBeenCalledWith('CLIENT_ID:CLIENT_SECRET');

    expect(bufferToString).toHaveBeenCalledTimes(1);
    expect(bufferToString).toHaveBeenCalledWith('base64');

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      ...request,
      headers: { Authorization: 'Basic 12345678' }
    });

    global.Buffer = originalBuffer;
  });

  it('uses client ID and secret to apply Basic authorization header in browser env', async () => {
    const middleware = createAuthMiddleware({
      token: 'bjd873indk',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const fetcher = jest.fn(() =>
      Promise.resolve({
        body: 'SUCCESS',
        status: 200,
        headers: {},
        request: {} as RequestConfig
      })
    );

    const mockBtoa = jest.fn(() => '12345678');
    //@ts-expect-error Ensure `window` is not undefined and
    // stub out btoa on Window object
    global.window = {
      btoa: mockBtoa
    };

    const request = {
      url: '/auth',
      method: 'POST',
      body: 'test',
      scheme: 'Basic'
    } as const;

    await middleware(fetcher)(request);

    expect(mockBtoa).toHaveBeenCalledTimes(1);
    expect(mockBtoa).toHaveBeenCalledWith('CLIENT_ID:CLIENT_SECRET');

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith({
      ...request,
      headers: { Authorization: 'Basic 12345678' }
    });

    delete (global as any).window;
  });
});
