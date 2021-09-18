import { Response } from '../types';
import {
  BaseApiErrorParameters,
  AuthenticationErrorParameters,
  PlayerErrorParameters
} from './types';

class BaseApiError extends Error {
  status: number;
  response: Response;
  name: string;

  constructor({ message, status, response, name }: BaseApiError) {
    super(message);
    this.status = status;
    this.response = response;
    this.name = name;
  }
}

export class AuthenticationError extends BaseApiError {
  error_description?: string;

  constructor({ error_description, ...rest }: AuthenticationErrorParameters) {
    super({ ...rest, name: 'AuthenticationError' });
    this.error_description = error_description;
  }
}

export class RegularError extends BaseApiError {
  constructor(params: BaseApiErrorParameters) {
    super({ ...params, name: 'RegularError' });
  }
}

export class PlayerError extends BaseApiError {
  reason: string;

  constructor({ reason, ...rest }: PlayerErrorParameters) {
    super({ ...rest, name: 'PlayerError' });
    this.reason = reason;
  }
}
