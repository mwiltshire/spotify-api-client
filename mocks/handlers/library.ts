import { rest } from 'msw';
import {
  savedAlbumsOffset0Limit1,
  savedAlbumsOffset1Limit1
} from '../responses/savedAlbums';

export const savedAlbums = rest.get(
  'https://api.spotify.com/v1/me/albums',
  (req, res, ctx) => {
    const offset = parseInt(req.url.searchParams.get('offset') as string, 10);
    const limit = parseInt(req.url.searchParams.get('limit') as string, 10);

    if (offset === 0 && limit === 1) {
      return res(ctx.status(200), ctx.json(savedAlbumsOffset0Limit1));
    }

    if (offset === 1 && limit === 1) {
      return res(ctx.status(200), ctx.json(savedAlbumsOffset1Limit1));
    }

    return res(ctx.status(400), ctx.json({ message: 'BAD REQUEST' }));
  }
);
