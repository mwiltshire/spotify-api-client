import {
  Response,
  UserIdObject,
  UserObjectPrivate,
  UserObjectPublic
} from '../types';

export type MeResponse = Promise<Response<UserObjectPrivate>>;

export type GetUserParameters = UserIdObject;

export type GetUserResponse = Promise<Response<UserObjectPublic>>;
