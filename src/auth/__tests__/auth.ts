import {
  createImplicitGrantUrl,
  createAuthorizationCodeUrl,
  createAuthorizationCodeWithPkceUrl,
  refreshAccessToken,
  authorizationCode,
  authorizationCodeWithPkce,
  clientCredentials
} from '../auth';
import { RequestConfig } from '../../types';

describe('createImplicitGrantUrl', () => {
  it('returns correctly formatted URL', () => {
    const url = createImplicitGrantUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=token'
    );
  });
});

describe('createAuthorizationCodeUrl', () => {
  it('returns correctly formatted URL', () => {
    const url = createAuthorizationCodeUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=code'
    );
  });

  it('returns correctly formatted URL with optional scope parameter', () => {
    const url = createAuthorizationCodeUrl({
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=code'
    );
  });
});

describe('createAuthorizationCodeWithPkceUrl', () => {
  it('returns correctly formatted URL', () => {
    const url = createAuthorizationCodeWithPkceUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234',
      code_challenge: 'kd83kn29dkk3kkjc93'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&code_challenge=kd83kn29dkk3kkjc93&response_type=code&code_challenge_method=S256'
    );
  });
});

describe('refreshAccessToken', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await refreshAccessToken(client, { refresh_token: '3jxd71jfbln38d' });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=refresh_token&refresh_token=3jxd71jfbln38d',
      scheme: 'Basic'
    });
  });
});

describe('authorizationCode', () => {
  it('calls client with correct request config - authorization code ', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await authorizationCode(client, {
      code: '1234',
      redirect_uri: 'https://test.com/callback'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=authorization_code&code=1234&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback',
      scheme: 'Basic'
    });
  });
});

describe('authorizationCodeWithPkce', () => {
  it('calls client with correct request config', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await authorizationCodeWithPkce(client, {
      client_id: '1234',
      code: '1234',
      code_verifier: 'jd83ifkhd29i',
      redirect_uri: 'https://test.com/callback'
    });

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=authorization_code&client_id=1234&code=1234&code_verifier=jd83ifkhd29i&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback'
    });
  });
});

describe('clientCredentials', () => {
  it('returns handler for endpoint', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await clientCredentials(client);

    expect(client).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials',
      scheme: 'Basic'
    });
  });
});
