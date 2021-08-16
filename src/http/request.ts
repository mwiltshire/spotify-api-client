import { removeEmpty } from '../utils';
import { RequestConfig } from '../types';

export function createRequestConfig(config: RequestConfig) {
  const { headers = {}, ...rest } = config;
  return removeEmpty({
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest
  }) as RequestConfig;
}

export function createBasicPostRequestConfig(
  config: Omit<RequestConfig, 'scheme' | 'method'>
) {
  return createPostRequestConfig({ ...config, scheme: 'Basic' });
}

export function createBearerGetRequestConfig(
  config: Omit<RequestConfig, 'scheme' | 'method'>
) {
  return createGetRequestConfig({ ...config, scheme: 'Bearer' });
}

export function createGetRequestConfig(config: Omit<RequestConfig, 'method'>) {
  return createRequestConfig({ ...config, method: 'GET' });
}

export function createPostRequestConfig(config: Omit<RequestConfig, 'method'>) {
  return createRequestConfig({ ...config, method: 'POST' });
}

export function createPutRequestConfig(config: Omit<RequestConfig, 'method'>) {
  return createRequestConfig({ ...config, method: 'PUT' });
}

export function createDeleteRequestConfig(
  config: Omit<RequestConfig, 'method'>
) {
  return createRequestConfig({ ...config, method: 'DELETE' });
}
