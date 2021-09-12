import * as ENDPOINTS from './endpoints';
import {
  AuthorizationCodeResponse,
  AuthorizationCodeParameters,
  AuthorizationCodeUrlParameters,
  ClientCredentialsResponse,
  CreateAuthorizationUrlParameters,
  ImplicitGrantUrlParameters,
  RefreshAccessTokenParameters,
  RefreshAccessTokenResponse,
  AuthorizationCodeWithPkceParameters,
  AuthorizationCodeWithPkceUrlParameters
} from './types';
import { Fetcher, RequestConfig } from '../types';
import { stringifyEntries, removeUndefinedEntries } from '../utils';

function prepareSearchParams(params: Record<string, any>) {
  return stringifyEntries(
    removeUndefinedEntries(Object.entries(params)),
    (arr) => arr.join(' ')
  );
}

function createAuthorizationUrl(
  parameters: CreateAuthorizationUrlParameters
): string {
  const preparedParams = prepareSearchParams(parameters);
  const base = ENDPOINTS.ACCOUNTS_AUTHORIZE;
  const searchParams = new URLSearchParams(preparedParams).toString();
  return `${base}?${searchParams}`;
}

export function createImplicitGrantUrl(
  parameters: Omit<ImplicitGrantUrlParameters, 'response_type'>
) {
  return createAuthorizationUrl({
    ...parameters,
    response_type: 'token'
  });
}

export function createAuthorizationCodeUrl(
  parameters: Omit<AuthorizationCodeUrlParameters, 'response_type'>
) {
  return createAuthorizationUrl({
    ...parameters,
    response_type: 'code'
  });
}

export function createAuthorizationCodeWithPkceUrl(
  parameters: Omit<
    AuthorizationCodeWithPkceUrlParameters,
    'response_type' | 'code_challenge_method'
  >
) {
  return createAuthorizationUrl({
    ...parameters,
    response_type: 'code',
    code_challenge_method: 'S256'
  });
}

export function refreshAccessToken(
  client: Fetcher,
  { refresh_token }: RefreshAccessTokenParameters
): RefreshAccessTokenResponse {
  return client({
    url: ENDPOINTS.ACCOUNTS_TOKEN,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token
    }).toString(),
    scheme: 'Basic'
  });
}

export function authorizationCode(
  client: Fetcher,
  parameters: AuthorizationCodeParameters
): AuthorizationCodeResponse {
  const request: RequestConfig = {
    url: ENDPOINTS.ACCOUNTS_TOKEN,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      ...parameters
    }).toString(),
    scheme: 'Basic'
  };

  return client(request);
}

export function authorizationCodeWithPkce(
  client: Fetcher,
  parameters: AuthorizationCodeWithPkceParameters
): AuthorizationCodeResponse {
  const request: RequestConfig = {
    url: ENDPOINTS.ACCOUNTS_TOKEN,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      ...parameters
    }).toString()
  };

  return client(request);
}

export function clientCredentials(client: Fetcher): ClientCredentialsResponse {
  return client({
    url: ENDPOINTS.ACCOUNTS_TOKEN,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials'
    }).toString(),
    scheme: 'Basic'
  });
}
