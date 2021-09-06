import { getShow, getShows, getEpisodesForShow } from '../shows';
import { RequestConfig } from '../../types';

describe('getShow', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getShow(client, {
      id: '38bS44xjbVVZ3No3ByF1dJ',
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/shows/38bS44xjbVVZ3No3ByF1dJ',
      params: {
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getShows(client, {
      ids: ['5CfCWKI5pZ28U0uOzXkDHe', '5as3aKmN2k11yfDDDSrvaZ'],
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/shows',
      params: {
        ids: ['5CfCWKI5pZ28U0uOzXkDHe', '5as3aKmN2k11yfDDDSrvaZ'],
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getEpisodesForShow', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getEpisodesForShow(client, {
      id: '38bS44xjbVVZ3No3ByF1dJ',
      limit: 10,
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/shows/38bS44xjbVVZ3No3ByF1dJ/episodes',
      params: {
        limit: 10,
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});
