import { RequestConfig } from '../../types';
import {
  getCategory,
  getPlaylistsForCategory,
  getCategories,
  getFeaturedPlaylists,
  getNewReleases,
  getRecommendations,
  getRecommendationGenres
} from '../browse';

describe('getCategory', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCategory(client, {
      category_id: 'party',
      country: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/categories/party',
      params: {
        country: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getPlaylistsForCategory', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getPlaylistsForCategory(client, {
      category_id: 'party',
      country: 'US',
      limit: 10,
      offset: 5
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/categories/party/playlists',
      params: {
        country: 'US',
        limit: 10,
        offset: 5
      },
      scheme: 'Bearer'
    });
  });
});

describe('getCategories', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCategories(client, {
      country: 'US',
      limit: 10,
      offset: 5
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/categories',
      params: {
        country: 'US',
        limit: 10,
        offset: 5
      },
      scheme: 'Bearer'
    });
  });

  it('calls client with correct request config - w/o optional params', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCategories(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/categories',
      scheme: 'Bearer'
    });
  });
});

describe('getFeaturedPlaylists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getFeaturedPlaylists(client, {
      country: 'US',
      limit: 10,
      offset: 5,
      timestamp: '2014-10-23T09:00:00',
      locale: 'de_DE'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/featured-playlists',
      params: {
        country: 'US',
        limit: 10,
        offset: 5,
        timestamp: '2014-10-23T09:00:00',
        locale: 'de_DE'
      },
      scheme: 'Bearer'
    });
  });

  it('calls client with correct request config - w/o optional params', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getFeaturedPlaylists(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/featured-playlists',
      scheme: 'Bearer'
    });
  });
});

describe('getNewReleases', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getNewReleases(client, {
      country: 'US',
      limit: 10,
      offset: 5
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/new-releases',
      params: {
        country: 'US',
        limit: 10,
        offset: 5
      },
      scheme: 'Bearer'
    });
  });

  it('calls client with correct request config - w/o optional params', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getNewReleases(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/browse/new-releases',
      scheme: 'Bearer'
    });
  });
});

describe('getRecommendations', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getRecommendations(client, {
      limit: 10,
      market: 'US',
      max_acousticness: 0.6,
      max_energy: 0.9,
      target_key: 0,
      min_liveness: 0.2,
      seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
      seed_tracks: ['0c6xIDDpzE81m2q797ordA']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/recommendations',
      params: {
        limit: 10,
        market: 'US',
        max_acousticness: 0.6,
        max_energy: 0.9,
        target_key: 0,
        min_liveness: 0.2,
        seed_artists: ['4NHQUGzhtTLFvgF5SZesLK'],
        seed_tracks: ['0c6xIDDpzE81m2q797ordA']
      },
      scheme: 'Bearer'
    });
  });

  it('calls client with correct request config - w/o optional params', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getRecommendations(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/recommendations',
      scheme: 'Bearer'
    });
  });
});

describe('getRecommendationGenres', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getRecommendationGenres(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      scheme: 'Bearer'
    });
  });
});
