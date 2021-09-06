import { Response, UserObjectPrivate, UserObjectPublic } from '../types';

export type MeResponse = Promise<Response<UserObjectPrivate>>;

export interface GetUserParameters {
  /** The user’s Spotify user ID. */
  user_id: string;
}

export type GetUserResponse = Promise<Response<UserObjectPublic>>;
