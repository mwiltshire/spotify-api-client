import { setupServer } from 'msw/node';
import { createClient } from '../../src';
import { fetcher } from '../../src/fetcher';
import { getCategories } from '../../src/browse';
import { categoriesOffset0 } from '../../mocks/responses/categories';
import { categories } from '../../mocks/handlers/categories';

const server = setupServer(categories);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('creating a client plus fetcher', () => {
  test('consumer can create a client and make request to Spotify', async () => {
    const client = createClient(fetcher);

    // In reality this would fail without any authentication.
    // Maybe this test is superfluous...
    const response = await getCategories(client);

    expect(response.body).toStrictEqual(categoriesOffset0);
  });
});
