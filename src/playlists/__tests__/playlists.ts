import {
  addItemsToPlaylist,
  changeDetailsForPlaylist,
  createPlaylist,
  getMyPlaylists,
  getPlaylistsForUser,
  getPlaylist,
  getCoverImageForPlaylist,
  listItemsInPlaylist,
  removeItemsFromPlaylist,
  reorderItemsInPlaylist,
  replaceItemsInPlaylist,
  uploadCoverImageForPlaylist
} from '../playlists';
import { RequestConfig } from '../../types';

describe('addItemsToPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await addItemsToPlaylist(client, {
      playlist_id: '7oi0w0SLbJ4YyjrOxhZbUv',
      uris: [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M',
        'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
      ],
      position: 3
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/7oi0w0SLbJ4YyjrOxhZbUv/tracks',
      body: {
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M',
          'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
        ],
        position: 3
      },
      scheme: 'Bearer'
    });
  });
});

describe('changeDetailsForPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await changeDetailsForPlaylist(client, {
      playlist_id: '7oi0w0SLbJ4YyjrOxhZbUv',
      name: 'Test',
      description: 'Test',
      public: false
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/7oi0w0SLbJ4YyjrOxhZbUv',
      body: {
        name: 'Test',
        description: 'Test',
        public: false
      },
      scheme: 'Bearer'
    });
  });
});

describe('createPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await createPlaylist(client, {
      user_id: 'my user #&',
      name: 'Test',
      description: 'Test',
      public: false
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/users/my%20user%20%23%26/playlists',
      body: {
        name: 'Test',
        description: 'Test',
        public: false
      },
      scheme: 'Bearer'
    });
  });
});

describe('getMyPlaylists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getMyPlaylists(client, {
      limit: 10,
      offset: 2
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/playlists',
      params: {
        limit: 10,
        offset: 2
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

    await getMyPlaylists(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/playlists',
      scheme: 'Bearer'
    });
  });
});

describe('getPlaylistsForUser', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getPlaylistsForUser(client, {
      user_id: 'my user #&'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/users/my%20user%20%23%26/playlists',
      scheme: 'Bearer'
    });
  });
});

describe('getPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      fields: ['tracks.items(added_at,added_by.id)']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC',
      params: {
        fields: ['tracks.items(added_at,added_by.id)']
      },
      scheme: 'Bearer'
    });
  });
});

describe('getCoverImageForPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getCoverImageForPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/images',
      scheme: 'Bearer'
    });
  });
});

describe('listItemsInPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await listItemsInPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      market: 'US'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/tracks',
      params: {
        market: 'US'
      },
      scheme: 'Bearer'
    });
  });
});

describe('removeItemsFromPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await removeItemsFromPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      tracks: [
        { uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh', positions: [0, 3] },
        { uri: 'spotify:track:1301WleyT98MSxVHPZCA6M', positions: [7] },
        { uri: 'spotify:episode:512ojhOuo1ktJprKbVcKyQ', positions: [8] }
      ],
      snapshot_id:
        'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/tracks',
      body: {
        tracks: [
          { uri: 'spotify:track:4iV5W9uYEdYUVa79Axb7Rh', positions: [0, 3] },
          { uri: 'spotify:track:1301WleyT98MSxVHPZCA6M', positions: [7] },
          { uri: 'spotify:episode:512ojhOuo1ktJprKbVcKyQ', positions: [8] }
        ],
        snapshot_id:
          'JbtmHBDBAYu3/bt8BOXKjzKx3i0b6LCa/wVjyl6qQ2Yf6nFXkbmzuEa+ZI/U1yF+'
      },
      scheme: 'Bearer'
    });
  });
});

describe('reorderItemsInPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await reorderItemsInPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      range_start: 0,
      insert_before: 4
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/tracks',
      body: {
        range_start: 0,
        insert_before: 4
      },
      scheme: 'Bearer'
    });
  });
});

describe('replaceItemsInPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await replaceItemsInPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      uris: [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M',
        'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
      ]
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/tracks',
      body: {
        uris: [
          'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
          'spotify:track:1301WleyT98MSxVHPZCA6M',
          'spotify:episode:512ojhOuo1ktJprKbVcKyQ'
        ]
      },
      scheme: 'Bearer'
    });
  });
});

describe('uploadCoverImageForPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await uploadCoverImageForPlaylist(client, {
      playlist_id: '59ZbFPES4DQwEjBpWHzrtC',
      image: 'ampkNzMya0tGS2YzampkajQmtES0unJDkwZGtla2hqZmVrbHdlZWY='
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      url: 'https://api.spotify.com/v1/playlists/59ZbFPES4DQwEjBpWHzrtC/images',
      body: 'ampkNzMya0tGS2YzampkajQmtES0unJDkwZGtla2hqZmVrbHdlZWY=',
      scheme: 'Bearer'
    });
  });
});
