import { getAlbum, getAlbums, getTracksForAlbum } from '../albums';
import { RequestConfig } from '../../types';

describe('getAlbum', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAlbum(client, {
      id: '0sNOF9WDwhWunNAHPD3Baj',
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj',
      params: {
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getTracksForAlbum', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getTracksForAlbum(client, {
      id: '0sNOF9WDwhWunNAHPD3Baj',
      market: 'US',
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/albums/0sNOF9WDwhWunNAHPD3Baj/tracks',
      params: {
        market: 'US',
        limit: 10
      },
      scheme: 'Bearer'
    });
  });
});

describe('getAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAlbums(client, {
      ids: [
        '0sNOF9WDwhWunNAHPD3Baj',
        '6JWc4iAiJ9FjyK0B59ABb4',
        '6UXCm6bOO4gFlDQZV5yL37'
      ],
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/albums',
      params: {
        ids: [
          '0sNOF9WDwhWunNAHPD3Baj',
          '6JWc4iAiJ9FjyK0B59ABb4',
          '6UXCm6bOO4gFlDQZV5yL37'
        ],
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});
