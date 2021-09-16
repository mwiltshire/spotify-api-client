import { setupServer } from 'msw/node';
import { createClient, Fetcher, RequestConfig } from '../../src';
import { fetcher } from '../../src/fetcher';
import { getCategories } from '../../src/browse';
import { authorizationCode } from '../../src/auth';
import {
  unauthorizedRequest,
  authorizationError
} from '../../mocks/handlers/errors';
import { categories } from '../../mocks/handlers/categories';
import { paginate } from '../../src/pagination';

const server = setupServer(unauthorizedRequest, authorizationError, categories);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('API errors', () => {
  test('failed request to regular endpoint throws RegularError', async () => {
    const client = createClient(fetcher);

    try {
      await getCategories(client);
    } catch (error) {
      expect(error.name).toBe('RegularError');
      expect(error.status).toBe(401);
      expect(error.message).toBe('UNAUTHORIZED');
    }
  });

  test('failed request to authentication endpoint throws AuthenticationError', async () => {
    const client = createClient(fetcher);

    try {
      await authorizationCode(client, {
        code: 'CODE',
        redirect_uri: 'https://test.com/callback'
      });
    } catch (error) {
      expect(error.name).toBe('AuthenticationError');
      expect(error.status).toBe(400);
      expect(error.message).toBe('invalid_request');
      expect(error.error_description).toBe('invalid_request');
    }
  });

  test('error caught and thrown from middleware is correctly processed', async () => {
    function augmentError(next: Fetcher) {
      return async (request: RequestConfig) => {
        try {
          const res = await next(request);
          return res;
        } catch (error) {
          error.message = `CAUGHT_IN_MIDDLEWARE: ${error.message}`;
          throw error;
        }
      };
    }

    const client = createClient(fetcher, augmentError);

    try {
      await getCategories(client);
    } catch (error) {
      expect(error.message).toBe('CAUGHT_IN_MIDDLEWARE: UNAUTHORIZED');
    }
  });

  test('error thrown during pagination is correctly caught', async () => {
    const client = createClient(fetcher);

    const paginater = paginate(getCategories, {
      backoff: 10
    });

    const pages = paginater(client, {
      offset: 0,
      limit: 5
    });

    const result = [];

    try {
      for await (const page of pages) {
        result.push(...page.categories.items.map((cat) => cat.name));
      }
    } catch (error) {
      expect(error.name).toBe('RegularError');
      expect(error.message).toBe('UNAUTHORIZED');
    }
  });
});
