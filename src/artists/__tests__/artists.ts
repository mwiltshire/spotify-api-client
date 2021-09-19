import {
  getArtist,
  getAlbumsForArtist,
  getTopTracksForArtist,
  getRelatedArtistsForArtist,
  getArtists
} from '../artists';
import { RequestConfig } from '../../types';

describe('getArtist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getArtist(client, {
      id: '0OdUWJ0sBjDrqHygGUXeCF'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF',
      scheme: 'Bearer'
    });
  });
});

describe('getAlbumsForArtist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAlbumsForArtist(client, {
      id: '0OdUWJ0sBjDrqHygGUXeCF',
      include_groups: ['album', 'appears_on'],
      country: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/albums',
      params: {
        include_groups: ['album', 'appears_on'],
        country: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getTopTracksForArtist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getTopTracksForArtist(client, {
      id: '0OdUWJ0sBjDrqHygGUXeCF',
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/top-tracks',
      params: {
        country: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getRelatedArtistsForArtist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getRelatedArtistsForArtist(client, {
      id: '0OdUWJ0sBjDrqHygGUXeCF'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/artists/0OdUWJ0sBjDrqHygGUXeCF/related-artists',
      scheme: 'Bearer'
    });
  });
});

describe('getArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getArtists(client, {
      ids: ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/artists',
      params: {
        ids: ['0oSGxfWSnnOXhD2fKuz2Gy', '3dBVyJ7JuOMt4GE9607Qin']
      },
      scheme: 'Bearer'
    });
  });
});
