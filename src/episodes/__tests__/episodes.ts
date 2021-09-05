import { RequestConfig } from '../../types';
import { getEpisode, getEpisodes } from '../episodes';

describe('getEpisode', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getEpisode(client, {
      id: '512ojhOuo1ktJprKbVcKyQ',
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/episodes/512ojhOuo1ktJprKbVcKyQ',
      params: {
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getEpisodes', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getEpisodes(client, {
      ids: ['77o6BIVlYM3msb4MMIL1jH', '0Q86acNRm6V9GYx55SXKwf'],
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/episodes',
      params: {
        ids: ['77o6BIVlYM3msb4MMIL1jH', '0Q86acNRm6V9GYx55SXKwf'],
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});
