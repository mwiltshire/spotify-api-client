export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type AuthenticationScheme = 'Bearer' | 'Basic';

export interface RequestConfig {
  [k: string]: any;
  url: string;
  method: HttpMethod;
  headers?: Record<string, any>;
  params?: Record<string, any>;
  body?: any;
  scheme?: AuthenticationScheme;
}

export interface Response<T = any> {
  [k: string]: any;
  body: T;
  status: number;
  headers: any;
}

export interface RequestError {
  status: number;
  message: string;
  headers: any;
  reason?: string;
}
