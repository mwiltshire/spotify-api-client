import { Response } from '../types';

export type UnpackResponse<T> = T extends Promise<Response<infer U>>
  ? U
  : never;
