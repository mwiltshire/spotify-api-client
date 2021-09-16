import { rest } from 'msw';

export const player = rest.put(
  'https://api.spotify.com/v1/me/player/play',
  (req, res, ctx) => {
    if (!req.headers.get('Authorization')) {
      return res(ctx.status(401), ctx.json({ message: 'UNAUTHORIZED' }));
    }
    return res(ctx.status(204));
  }
);
