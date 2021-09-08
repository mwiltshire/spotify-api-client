import { createBasicAuthMiddleware } from './createBasicAuthMiddleware';
import { createBearerAuthMiddleware } from './createBearerAuthMiddleware';
import { AuthMiddlewareConfig, Middleware } from './types';

export function createAuthMiddleware({
  token,
  client_id,
  client_secret
}: AuthMiddlewareConfig): Middleware {
  const addBasicAuth = createBasicAuthMiddleware({ client_id, client_secret });
  const addBearerAuth = createBearerAuthMiddleware({ token });
  return (next) => (request) => addBearerAuth(addBasicAuth(next))(request);
}
