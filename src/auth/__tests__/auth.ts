import {
  createAuthorizationUrl,
  createImplicitGrantFlowUrl,
  createAuthorizationCodeFlowUrl,
  refreshAccessToken,
  authorizationCodeFlow,
  clientCredentialsFlow
} from '../auth';
import { RequestConfig } from '../../types';

describe('createAuthorizationUrl', () => {
  it('returns correctly formatted URL - authorization code flow', () => {
    const url = createAuthorizationUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234',
      response_type: 'code'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=code'
    );
  });

  it('returns correctly formatted URL - authorization code flow with PKCE', () => {
    const url = createAuthorizationUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234',
      response_type: 'code',
      code_challenge: 'kd83kn29dkk3kkjc93'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=code&code_challenge=kd83kn29dkk3kkjc93&code_challenge_method=S256'
    );
  });

  it('returns correctly formatted URL - implicit grant flow', () => {
    const url = createAuthorizationUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234',
      response_type: 'token'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=token'
    );
  });

  it('returns correctly formatted URL with optional show_dialog parameter', () => {
    const url = createAuthorizationUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      response_type: 'token',
      state: '1234',
      show_dialog: true
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&response_type=token&state=1234&show_dialog=true'
    );
  });
});

describe('createImplicitGrantFlowUrl', () => {
  it('returns correctly formatted URL', () => {
    const url = createImplicitGrantFlowUrl({
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

describe('createAuthorizationCodeFlowUrl', () => {
  it('returns correctly formatted URL - authorization code flow', () => {
    const url = createAuthorizationCodeFlowUrl({
      scope: ['user-follow-modify', 'user-read-currently-playing'],
      client_id: 'h37djjslxo3lm',
      redirect_uri: 'https://test.com/callback',
      state: '1234'
    });
    expect(url).toBe(
      'https://accounts.spotify.com/authorize?scope=user-follow-modify+user-read-currently-playing&client_id=h37djjslxo3lm&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback&state=1234&response_type=code'
    );
  });

  it('returns correctly formatted URL - authorization code flow with PKCE', () => {
    const url = createAuthorizationCodeFlowUrl({
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

describe('authorizationCodeFlow', () => {
  it('calls client with correct request config - authorization code flow', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await authorizationCodeFlow(client, {
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

  it('calls client with correct request config - authorization code flow with PKCE', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await authorizationCodeFlow(client, {
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
      body: 'grant_type=authorization_code&code=1234&code_verifier=jd83ifkhd29i&redirect_uri=https%3A%2F%2Ftest.com%2Fcallback'
    });
  });
});

describe('clientCredentialsFlow', () => {
  it('returns handler for endpoint', async () => {
    const client = jest.fn(() =>
      Promise.resolve({
        status: 200,
        headers: {},
        body: {},
        request: {} as RequestConfig
      })
    );

    await clientCredentialsFlow(client);

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
