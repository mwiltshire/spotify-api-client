import { setupServer } from 'msw/node';
import { createClient } from '../../src';
import { fetcher } from '../../src/fetcher';
import { paginate } from '../../src/pagination';
import { categories } from '../../mocks/handlers/categories';
import { savedAlbums } from '../../mocks/handlers/library';
import { getSavedAlbums } from '../../src/library';
import { getCategories } from '../../src/browse';

const server = setupServer(savedAlbums, categories);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});

describe('paginating requests', () => {
  test('requests are made until `next` field on response returns `null` - top-level `next` field', async () => {
    const client = createClient(fetcher);

    const pages = paginate(getSavedAlbums)(client, {
      offset: 0,
      limit: 1
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(page.items[0].album.name);
    }

    expect(result).toEqual(['Greatest Hits 1', 'Greatest Hits 2']);
    expect(requestCount).toBe(2);
  });

  test('requests are made until `next` field on response returns `null` - nested `next` field', async () => {
    const client = createClient(fetcher);

    const pages = paginate(getCategories)(client, {
      offset: 0,
      limit: 5
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(...page.categories.items.map((cat) => cat.name));
    }

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
    expect(requestCount).toBe(3);
  });

  test('`maxRequests` stops pagination when the specified number of pages has been met', async () => {
    const client = createClient(fetcher);

    const paginater = paginate(getCategories, {
      maxRequests: 2
    });

    const pages = paginater(client, {
      offset: 0,
      limit: 5
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(...page.categories.items.map((cat) => cat.name));
    }

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
      'Lazy'
    ]);
    expect(requestCount).toBe(2);
  });

  test('`maxItems` specifies the maximum number of items to return', async () => {
    const client = createClient(fetcher);

    const paginater = paginate(getCategories, {
      maxItems: 12
    });

    const pages = paginater(client, {
      offset: 0,
      limit: 5
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(...page.categories.items.map((cat) => cat.name));
    }

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
      'Summer'
    ]);
    // Only three requests should have been made here. There are 15
    // items in total and an initial page size of 5. After the second
    // request the third and final page, with two items, is fetched.
    expect(requestCount).toBe(3);
  });

  test('`maxRequests` takes precedence over `maxItems`', async () => {
    const client = createClient(fetcher);

    const paginater = paginate(getCategories, {
      maxRequests: 1,
      maxItems: 12
    });

    const pages = paginater(client, {
      offset: 0,
      limit: 5
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(...page.categories.items.map((cat) => cat.name));
    }

    expect(result).toEqual(['Top Lists', 'Mood', 'Party', 'Pop', 'Workout']);
    expect(requestCount).toBe(1);
  });

  test('`maxItems` value lower than initial `limit` takes precendence', async () => {
    const client = createClient(fetcher);

    const paginater = paginate(getCategories, {
      maxItems: 4
    });

    const pages = paginater(client, {
      offset: 0,
      limit: 5
    });

    let requestCount = 0;

    const result = [];

    for await (const page of pages) {
      requestCount++;
      result.push(...page.categories.items.map((cat) => cat.name));
    }

    expect(result).toEqual(['Top Lists', 'Mood', 'Party', 'Pop']);
    expect(requestCount).toBe(1);
  });
});
