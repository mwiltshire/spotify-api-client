export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AuthenticationScheme = 'Bearer' | 'Basic';

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
  scheme?: AuthenticationScheme;
  signal?: AbortSignal;
}

export interface Response<T = any> {
  body: T;
  status: number;
  headers: any;
  request: RequestConfig;
}

export interface RequestError {
  status: number;
  message: string;
  headers: any;
  reason?: string;
}
