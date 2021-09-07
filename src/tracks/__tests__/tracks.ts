import {
  getAudioAnalysisForTrack,
  getAudioFeaturesForTrack,
  getAudioFeaturesForTracks,
  getTracks,
  getTrack
} from '../tracks';
import { RequestConfig } from '../../types';

describe('getAudioAnalysisForTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAudioAnalysisForTrack(client, {
      id: '3JIxjvbbDrA9ztYlNcp3yL'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/audio-analysis/3JIxjvbbDrA9ztYlNcp3yL',
      scheme: 'Bearer'
    });
  });
});

describe('getAudioFeaturesForTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAudioFeaturesForTrack(client, {
      id: '3JIxjvbbDrA9ztYlNcp3yL'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/audio-features/3JIxjvbbDrA9ztYlNcp3yL',
      scheme: 'Bearer'
    });
  });
});

describe('getAudioFeaturesForTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAudioFeaturesForTracks(client, {
      ids: [
        '4JpKVNYnVcJ8tuMKjAj50A',
        '2NRANZE9UCmPAS5XVbXL40',
        '24JygzOLM0EmRQeGtFcIcG'
      ]
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/audio-features',
      params: {
        ids: [
          '4JpKVNYnVcJ8tuMKjAj50A',
          '2NRANZE9UCmPAS5XVbXL40',
          '24JygzOLM0EmRQeGtFcIcG'
        ]
      },
      scheme: 'Bearer'
    });
  });
});

describe('getTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getTracks(client, {
      ids: [
        '4JpKVNYnVcJ8tuMKjAj50A',
        '2NRANZE9UCmPAS5XVbXL40',
        '24JygzOLM0EmRQeGtFcIcG'
      ]
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/tracks',
      params: {
        ids: [
          '4JpKVNYnVcJ8tuMKjAj50A',
          '2NRANZE9UCmPAS5XVbXL40',
          '24JygzOLM0EmRQeGtFcIcG'
        ]
      },
      scheme: 'Bearer'
    });
  });
});

describe('getTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getTrack(client, {
      id: '3JIxjvbbDrA9ztYlNcp3yL'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/tracks/3JIxjvbbDrA9ztYlNcp3yL',
      scheme: 'Bearer'
    });
  });
});
