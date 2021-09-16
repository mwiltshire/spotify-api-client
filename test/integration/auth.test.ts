import { setupServer } from 'msw/node';
import { auth } from '../../mocks/handlers/auth';
import { categories } from '../../mocks/handlers/categories';
import { authorizationCode, refreshAccessToken } from '../../src/auth';
import { getCategories } from '../../src/browse';
import { createClient } from '../../src';
import { fetcher } from '../../src/fetcher';
import { createAuthMiddleware } from '../../src/middleware';
import { composeMiddleware } from '../../src/middleware';
import { Fetcher, RequestConfig } from '../../src/types';

const server = setupServer(auth, categories);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('auth flow', () => {
  test('consumer can obtain a token, make an authenticated request and then refresh the token', async () => {
    let accessToken: string;
    let refreshToken: string;

    let getTokenCalls = 0;

    async function setAccessToken(newToken: string) {
      await Promise.resolve();
      accessToken = newToken;
    }

    async function setRefreshToken(newToken: string) {
      await Promise.resolve();
      refreshToken = newToken;
    }

    async function getToken() {
      getTokenCalls++;

      if (getTokenCalls > 1) {
        const addAuth = createAuthMiddleware({
          token: 'bjd873indk',
          client_id: 'CLIENT_ID',
          client_secret: 'CLIENT_SECRET'
        });

        const refreshTokenClient = createClient(fetcher, addAuth);
        const refreshTokenResponse = await refreshAccessToken(
          refreshTokenClient,
          { refresh_token: refreshToken }
        );

        accessToken = refreshTokenResponse.body.access_token;
        await setAccessToken(refreshTokenResponse.body.access_token);
      }

      return accessToken;
    }

    const mockLogger = jest.fn();

    const loggerMiddleware = (next: Fetcher) => (request: RequestConfig) => {
      mockLogger(`AUTH: ${request.headers?.Authorization}`);
      return next(request);
    };

    const authMiddleware = createAuthMiddleware({
      token: getToken,
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET'
    });

    const client = createClient(
      fetcher,
      composeMiddleware(authMiddleware, loggerMiddleware)
    );

    const authResponse = await authorizationCode(client, {
      code: 'AUTH_CODE_FLOW',
      redirect_uri: 'https://test.com/callback'
    });

    expect(mockLogger).toHaveBeenCalledTimes(1);
    expect(mockLogger).toHaveBeenNthCalledWith(
      1,
      'AUTH: Basic Q0xJRU5UX0lEOkNMSUVOVF9TRUNSRVQ='
    );

    await setAccessToken(authResponse.body.access_token);
    await setRefreshToken(authResponse.body.refresh_token);

    await getCategories(client);

    expect(mockLogger).toHaveBeenCalledTimes(2);
    expect(mockLogger).toHaveBeenNthCalledWith(
      2,
      'AUTH: Bearer NgCXRKFjj4fJdj4g9i2kd9FLMzYjw'
    );

    await getCategories(client);

    expect(mockLogger).toHaveBeenCalledTimes(3);
    expect(mockLogger).toHaveBeenNthCalledWith(
      3,
      'AUTH: Bearer NgA6ZcYIfj883fk3ixn8bUQ'
    );
  });
});
