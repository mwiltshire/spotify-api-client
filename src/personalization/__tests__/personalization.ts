import { getMyTopArtists, getMyTopTracks } from '../personalization';
import { RequestConfig } from '../../types';

describe('getMyTopArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getMyTopArtists(client, {
      limit: 10,
      time_range: 'short_term'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/top/artists',
      params: {
        limit: 10,
        time_range: 'short_term'
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

    await getMyTopArtists(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/top/artists',
      scheme: 'Bearer'
    });
  });
});

describe('getMyTopTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getMyTopTracks(client, {
      limit: 10,
      time_range: 'short_term'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/top/tracks',
      params: {
        limit: 10,
        time_range: 'short_term'
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

    await getMyTopTracks(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/top/tracks',
      scheme: 'Bearer'
    });
  });
});
