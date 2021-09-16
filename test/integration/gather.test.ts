import { setupServer } from 'msw/node';
import { createClient } from '../../src';
import { fetcher } from '../../src/fetcher';
import { gather } from '../../src/pagination';
import { categories } from '../../mocks/handlers/categories';
import { getCategories } from '../../src/browse';

const server = setupServer(categories);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('gathering responses', () => {
  test('gather collects up all responses as a result of pagination', async () => {
    const client = createClient(fetcher);

    const gatherer = gather(
      getCategories,
      ({ categories }) => categories.items.map(({ name }) => name),
      { backoff: 10 }
    );

    const result = await gatherer(client, {
      offset: 0,
      limit: 5
    });

    expect(result).toEqual([
      'Top Lists',
      'Mood',
      'Party',
      'Pop',
      'Workout',
      'Sleep',
      'Cooking',
      'Chill',
      'Random',
      'Lazy',
      'Jazzy',
      'Summer',
      'Holiday',
      'Rap',
      'British'
    ]);
  });
});
