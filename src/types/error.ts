export interface RegularErrorResponse {
  error: {
    status: number;
    message: string;
    // This `reason` field isn't mentioned in the docs but
    // may be returned in case of a web API player error.
    reason?: string;
  };
}

export interface AuthenticationErrorResponse {
  error: string;
  // Unsure whether this is always present but it is
  // specified in the API docs.
  error_description?: string;
}

export interface BaseApiErrorParameters {
  message: string;
  status: number;
  response: Response;
}

export interface AuthenticationErrorParameters extends BaseApiErrorParameters {
  error_description?: string;
}

export interface RegularErrorParameters extends BaseApiErrorParameters {
  reason?: string;
}
