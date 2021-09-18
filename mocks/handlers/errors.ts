import { rest } from 'msw';

const response401 = {
  error: {
    status: 401,
    message: 'UNAUTHORIZED'
  }
};

const authErrorResponse = {
  error: 'invalid_request',
  error_description: 'invalid_request'
};

const alreadyPausedResponse = {
  error: {
    message: 'ERROR!',
    reason: 'ALREADY_PAUSED',
    status: 400
  }
};

export const unauthorizedRequest = rest.get(
  'https://api.spotify.com/v1/browse/categories',
  (_, res, ctx) => res(ctx.status(401), ctx.json(response401))
);

export const authorizationError = rest.post(
  'https://accounts.spotify.com/api/token',
  (_, res, ctx) => res(ctx.status(400), ctx.json(authErrorResponse))
);

export const pauseError = rest.put(
  'https://api.spotify.com/v1/me/player/pause',
  (_, res, ctx) => {
    return res(ctx.status(400), ctx.json(alreadyPausedResponse));
  }
);
