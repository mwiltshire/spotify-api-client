import {
  isFollowingArtists,
  isFollowingUsers,
  areFollowingPlaylist,
  followArtists,
  followUsers,
  followPlaylist,
  getFollowedArtists,
  unfollowArtists,
  unfollowUsers,
  unfollowPlaylist
} from '../follow';
import { RequestConfig } from '../../types';

describe('isFollowingArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await isFollowingArtists(client, {
      ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following/contains',
      params: {
        type: 'artist',
        ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
      },
      scheme: 'Bearer'
    });
  });
});

describe('isFollowingUsers', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await isFollowingUsers(client, {
      ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following/contains',
      params: {
        type: 'user',
        ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
      },
      scheme: 'Bearer'
    });
  });
});

describe('areFollowingPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await areFollowingPlaylist(client, {
      playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT',
      ids: ['user1', 'user2']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers/contains',
      params: {
        ids: ['user1', 'user2']
      },
      scheme: 'Bearer'
    });
  });
});

describe('followArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await followArtists(client, {
      ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'artist',
        ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
      },
      scheme: 'Bearer'
    });
  });
});

describe('followUsers', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await followUsers(client, {
      ids: ['user1', 'user2']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'user',
        ids: ['user1', 'user2']
      },
      scheme: 'Bearer'
    });
  });
});

describe('followPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await followPlaylist(client, {
      playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT',
      public: false
    });

    expect(client).toHaveBeenCalledWith({
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers',
      body: { public: false },
      scheme: 'Bearer'
    });
  });
});

describe('getFollowedArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await getFollowedArtists(client, {
      limit: 10
    });

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'artist',
        limit: 10
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

    await getFollowedArtists(client);

    expect(client).toHaveBeenCalledWith({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'artist'
      },
      scheme: 'Bearer'
    });
  });
});

describe('unfollowArtists', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await unfollowArtists(client, {
      ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'artist',
        ids: ['74ASZWbe4lXaubB36ztrGX', '08td7MxkoHQkXnWAYD8d6Q']
      },
      scheme: 'Bearer'
    });
  });
});

describe('unfollowUsers', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await unfollowUsers(client, {
      ids: ['user1', 'user2']
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/me/following',
      params: {
        type: 'user',
        ids: ['user1', 'user2']
      },
      scheme: 'Bearer'
    });
  });
});

describe('unfollowPlaylist', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await unfollowPlaylist(client, {
      playlist_id: '2v3iNvBX8Ay1Gt2uXtUKUT'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      url: 'https://api.spotify.com/v1/playlists/2v3iNvBX8Ay1Gt2uXtUKUT/followers',
      scheme: 'Bearer'
    });
  });
});
