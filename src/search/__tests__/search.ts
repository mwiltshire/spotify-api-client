import {
  searchAlbums,
  searchArtists,
  searchEpisodes,
  searchPlaylists,
  searchShows,
  searchTracks,
  search
} from '../search';
import { RequestConfig } from '../../types';

describe('searchAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchAlbums(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'album',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('searchArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchArtists(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'artist',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('searchEpisodes', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchEpisodes(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'episode',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('searchPlaylists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchPlaylists(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'playlist',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('searchShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchShows(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'show',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('searchTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await searchTracks(client, {
      q: 'test',
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: 'track',
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('search', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await search(client, {
      q: 'test',
      type: ['artist', 'album'],
      market: 'US',
      offset: 0,
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/search',
      params: {
        q: 'test',
        type: ['artist', 'album'],
        market: 'US',
        offset: 0,
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});
