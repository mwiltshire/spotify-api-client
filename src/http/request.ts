import { removeEmpty } from '../utils';
import { AuthenticationScheme, HttpMethod, RequestConfig } from '../types';

function withHeaders(headers: Record<string, any>) {
  return (config: RequestConfig) => {
    return {
      ...config,
      headers: {
        ...headers,
        ...config.headers
      }
    };
  };
}

function withMethod(method: HttpMethod) {
  return (config: Omit<RequestConfig, 'method'>) => {
    return {
      ...config,
      method
    };
  };
}

function withScheme(scheme: AuthenticationScheme) {
  return (config: Omit<RequestConfig, 'scheme'>) => {
    return {
      ...config,
      scheme
    };
  };
}

const withApplicationJson = withHeaders({ 'Content-Type': 'application/json' });

const withGet = withMethod('GET');
const withPost = withMethod('POST');
const withPut = withMethod('PUT');
const withDelete = withMethod('DELETE');

const withBearerScheme = withScheme('Bearer');

const pipeConfig =
  (...fns: Array<(config: any) => RequestConfig>) =>
  (r: Omit<RequestConfig, 'method'>) =>
    fns.reduce((v, f) => f(v), r) as RequestConfig;

export const get = pipeConfig(
  withGet,
  withBearerScheme,
  withApplicationJson,
  removeEmpty
);

export const post = pipeConfig(
  withPost,
  withBearerScheme,
  withApplicationJson,
  removeEmpty
);

export const put = pipeConfig(
  withPut,
  withBearerScheme,
  withApplicationJson,
  removeEmpty
);

export const delete_ = pipeConfig(
  withDelete,
  withBearerScheme,
  withApplicationJson,
  removeEmpty
);
