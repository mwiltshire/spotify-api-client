import { Response } from '../types';

export type Scope =
  | 'ugc-image-upload'
  | 'user-read-playback-state'
  | 'user-modify-playback-state'
  | 'user-read-currently-playing'
  | 'app-remote-control'
  | 'user-read-email'
  | 'user-read-private'
  | 'playlist-read-collaborative'
  | 'playlist-modify-public'
  | 'playlist-read-private'
  | 'playlist-modify-private'
  | 'user-library-modify'
  | 'user-library-read'
  | 'user-top-read'
  | 'user-read-playback-position'
  | 'user-read-recently-played'
  | 'user-follow-read'
  | 'user-follow-modify';

export interface AuthorizationUrlParameters {
  client_id: string;
  redirect_uri: string;
  state?: string;
  scope?: Scope[];
  show_dialog?: boolean;
  response_type: 'code' | 'token';
}

export interface AuthorizationCodeFlowUrlParameters
  extends AuthorizationUrlParameters {
  response_type: 'code';
  code_challenge?: string;
}

export interface ImplicitGrantFlowUrlParameters
  extends AuthorizationUrlParameters {
  response_type: 'token';
}

export type CreateAuthorizationUrlParameters =
  | AuthorizationCodeFlowUrlParameters
  | ImplicitGrantFlowUrlParameters;

export interface RefreshAccessTokenParameters {
  refresh_token: string;
}

export interface AccessToken {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export type RefreshAccessTokenResponse = Promise<Response<AccessToken>>;

export interface AuthorizationCodeFlowParameters {
  code: string;
  redirect_uri: string;
  code_verifier?: string;
}

export interface RefreshableAccessToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export type AuthorizationCodeFlowResponse = Promise<
  Response<RefreshableAccessToken>
>;

export interface ClientCredentialsResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export type ClientCredentialsFlowResponse = Promise<
  Response<ClientCredentialsResponse>
>;
