import { fetcher } from '../fetcher';

describe('fetcher', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('calls global fetch with request init object', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve({})
      })
    );

    const response = await fetcher({
      url: 'https://api.test.com/test',
      method: 'GET',
      headers: {
        Authorization: 'Bearer 1234'
      },
      params: {
        foo: 123
      }
    });

    expect(response.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.test.com/test?foo=123',
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        signal: null
      }
    );
  });

  it('catches and rethrows error thrown by fetch', async () => {
    (global.fetch as any) = jest.fn(() => Promise.reject(new Error('ERROR')));

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('Error');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - regular error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 401,
        ok: false,
        json: () => Promise.resolve({ error: { message: 'ERROR' } })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('RegularError');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - authentication error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () => Promise.resolve({ error: 'ERROR' })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('AuthenticationError');
      expect(error.message).toBe('ERROR');
    }
  });

  it('throws if response.ok is false - unknown error', async () => {
    (global.fetch as any) = jest.fn(() =>
      Promise.resolve({
        status: 400,
        ok: false,
        json: () => Promise.resolve({ message: 'ERROR' })
      })
    );

    try {
      await fetcher({
        url: 'https://api.test.com/test',
        method: 'GET',
        headers: {
          Authorization: 'Bearer 1234'
        },
        params: {
          foo: 123
        }
      });
    } catch (error) {
      expect(error.name).toBe('Error');
      expect(error.message).toBe('[spotify api client] unknown error');
    }
  });
});
