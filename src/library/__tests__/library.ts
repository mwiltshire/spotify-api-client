import { RequestConfig } from '../../types';
import {
  checkSavedAlbums,
  checkSavedShows,
  checkSavedTracks,
  getSavedAlbums,
  getSavedShows,
  getSavedTracks,
  removeSavedAlbums,
  removeSavedShows,
  removeSavedTracks,
  saveAlbums,
  saveShows,
  saveTracks
} from '../library';

describe('checkSavedAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await checkSavedAlbums(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/albums/contains',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('checkSavedShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await checkSavedShows(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/shows/contains',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('checkSavedTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await checkSavedTracks(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/tracks/contains',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('getSavedAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getSavedAlbums(client, {
      limit: 10,
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/albums',
      params: {
        limit: 10,
        market: 'US'
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

    await getSavedAlbums(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/albums',
      scheme: 'Bearer'
    });
  });
});

describe('getSavedShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getSavedShows(client, {
      limit: 10,
      offset: 1
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/shows',
      params: {
        limit: 10,
        offset: 1
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

    await getSavedShows(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/shows',
      scheme: 'Bearer'
    });
  });
});

describe('getSavedTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getSavedTracks(client, {
      limit: 10,
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/tracks',
      params: {
        limit: 10,
        market: 'US'
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

    await getSavedTracks(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/tracks',
      scheme: 'Bearer'
    });
  });
});

describe('removeSavedAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await removeSavedAlbums(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/albums',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('removeSavedShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await removeSavedShows(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/shows',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('removeSavedTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await removeSavedTracks(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/tracks',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('saveAlbums', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await saveAlbums(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/albums',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('saveShows', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await saveShows(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/shows',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});

describe('saveTracks', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await saveTracks(client, {
      ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/tracks',
      params: {
        ids: ['0pJJgBzj26qnE1nSQUxaB0', '5ZAKzV4ZIa5Gt7z29OYHv0']
      },
      scheme: 'Bearer'
    });
  });
});
