import * as ENDPOINTS from './endpoints';
import { Fetcher, RequestConfig } from '../types';
import {
  AuthorizationCodeFlowResponse,
  AuthorizationCodeFlowParameters,
  AuthorizationCodeFlowUrlParameters,
  ClientCredentialsFlowResponse,
  CreateAuthorizationUrlParameters,
  ImplicitGrantFlowUrlParameters,
  RefreshAccessTokenParameters,
  RefreshAccessTokenResponse
} from './types';

export function createAuthorizationUrl({
  scope,
  show_dialog,
  ...rest
}: CreateAuthorizationUrlParameters): string {
  const query: Record<string, any> = {
    scope: scope ? scope.join(' ') : scope,
    ...rest
  };

  if (typeof show_dialog !== 'undefined') {
    query.show_dialog = show_dialog.toString();
  }

  // This is PKCE flow, so add the required S256 code
  // challenge method field.
  if (rest.response_type === 'code' && rest.code_challenge) {
    query.code_challenge_method = 'S256';
  }

  const base = ENDPOINTS.ACCOUNTS_AUTHORIZE;
  const params = new URLSearchParams(query).toString();

  return `${base}?${params}`;
}

export function createImplicitGrantFlowUrl(
  parameters: Omit<ImplicitGrantFlowUrlParameters, 'response_type'>
) {
  return createAuthorizationUrl({
    ...parameters,
    response_type: 'token'
  });
}

export function createAuthorizationCodeFlowUrl(
  parameters: Omit<AuthorizationCodeFlowUrlParameters, 'response_type'>
) {
  const { code_challenge } = parameters;
  return createAuthorizationUrl({
    ...parameters,
    ...(code_challenge && {
      code_challenge
    }),
    response_type: 'code'
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

export function authorizationCodeFlow(
  client: Fetcher,
  parameters: AuthorizationCodeFlowParameters
): AuthorizationCodeFlowResponse {
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

  // If a code verifier wasn't provided then this is
  // a standard authorization code flow request and
  // Basic scheme should be used, otherwise no scheme
  // is applied.
  if (typeof parameters.code_verifier === 'undefined') {
    request.scheme = 'Basic';
  }

  return client(request);
}

export function clientCredentialsFlow(
  client: Fetcher
): ClientCredentialsFlowResponse {
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
