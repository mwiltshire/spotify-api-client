import { RequestConfig } from '../../types';
import {
  addToPlaybackQueue,
  getAvailableDevices,
  getCurrentlyPlayingTrack,
  getCurrentPlaybackContext,
  getRecentlyPlayedTracks,
  pause,
  play,
  repeat,
  seek,
  setVolume,
  shuffle,
  skipToNextTrack,
  skipToPreviousTrack,
  transferPlayback
} from '../player';

describe('addToPlaybackQueue', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await addToPlaybackQueue(client, {
      uri: 'test:uri',
      device_id: 'jd3ivgjkDjKf39dj'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/queue',
      params: {
        uri: 'test:uri',
        device_id: 'jd3ivgjkDjKf39dj'
      },
      scheme: 'Bearer'
    });
  });
});

describe('getAvailableDevices', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getAvailableDevices(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/devices',
      scheme: 'Bearer'
    });
  });
});

describe('getCurrentPlaybackContext', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCurrentPlaybackContext(client, {
      market: 'US',
      additional_types: ['episode']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player',
      params: {
        market: 'US',
        additional_types: ['episode']
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

    await getCurrentPlaybackContext(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player',
      scheme: 'Bearer'
    });
  });
});

describe('getRecentlyPlayedTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getRecentlyPlayedTracks(client, {
      limit: 50,
      after: 1591037279330
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      params: {
        limit: 50,
        after: 1591037279330
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

    await getRecentlyPlayedTracks(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/recently-played',
      scheme: 'Bearer'
    });
  });
});

describe('getCurrentlyPlayingTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCurrentlyPlayingTrack(client, {
      market: 'US',
      additional_types: ['episode']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      params: {
        market: 'US',
        additional_types: ['episode']
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

    await getCurrentlyPlayingTrack(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      scheme: 'Bearer'
    });
  });
});

describe('pause', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await pause(client, {
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/pause',
      params: {
        device_id: '8dJ3df8dfj9kdk'
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

    await pause(client);

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/pause',
      scheme: 'Bearer'
    });
  });
});

describe('seek', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await seek(client, {
      position_ms: 10000,
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/seek',
      params: {
        position_ms: 10000,
        device_id: '8dJ3df8dfj9kdk'
      },
      scheme: 'Bearer'
    });
  });
});

describe('repeat', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await repeat(client, {
      state: 'off',
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/repeat',
      params: {
        state: 'off',
        device_id: '8dJ3df8dfj9kdk'
      },
      scheme: 'Bearer'
    });
  });
});

describe('setVolume', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await setVolume(client, {
      volume_percent: 100,
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/volume',
      params: {
        volume_percent: 100,
        device_id: '8dJ3df8dfj9kdk'
      },
      scheme: 'Bearer'
    });
  });
});

describe('skipToNextTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await skipToNextTrack(client, {
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/next',
      params: {
        device_id: '8dJ3df8dfj9kdk'
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

    await skipToNextTrack(client);

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/next',
      scheme: 'Bearer'
    });
  });
});

describe('skipToPreviousTrack', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await skipToPreviousTrack(client, {
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/previous',
      params: {
        device_id: '8dJ3df8dfj9kdk'
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

    await skipToPreviousTrack(client);

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/previous',
      scheme: 'Bearer'
    });
  });
});

describe('play', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await play(client, {
      device_id: '8dJ3df8dfj9kdk',
      context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT',
      offset: {
        uri: 'spotify:track:1301WleyT98MSxVHPZCA6M'
      },
      position_ms: 25000
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/play',
      params: {
        device_id: '8dJ3df8dfj9kdk'
      },
      body: {
        context_uri: 'spotify:album:1Je1IMUlBXcx1Fz0WE7oPT',
        offset: {
          uri: 'spotify:track:1301WleyT98MSxVHPZCA6M'
        },
        position_ms: 25000
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

    await play(client);

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/play',
      scheme: 'Bearer'
    });
  });
});

describe('shuffle', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await shuffle(client, {
      state: 'on',
      device_id: '8dJ3df8dfj9kdk'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player/shuffle',
      params: {
        state: 'on',
        device_id: '8dJ3df8dfj9kdk'
      },
      scheme: 'Bearer'
    });
  });
});

describe('transferPlayback', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await transferPlayback(client, {
      device_ids: ['74ASZWbe4lXaubB36ztrGX'],
      play: true
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/player',
      params: {
        device_ids: ['74ASZWbe4lXaubB36ztrGX'],
        play: true
      },
      scheme: 'Bearer'
    });
  });
});
