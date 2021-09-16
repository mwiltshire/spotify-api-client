import { rest } from 'msw';
import {
  categoriesOffset0,
  categoriesOffset0Limit4,
  categoriesOffset5,
  categoriesOffset10,
  categoriesOffset5Limit10,
  categoriesOffset10Limit2
} from '../responses/categories';

export const categories = rest.get(
  'https://api.spotify.com/v1/browse/categories',
  (req, res, ctx) => {
    const offset = parseInt(req.url.searchParams.get('offset') as string, 10);
    const limit = parseInt(req.url.searchParams.get('limit') as string, 10);

    if (offset === 0 && limit === 4) {
      return res(ctx.status(200), ctx.json(categoriesOffset0Limit4));
    }

    if (offset === 5 && limit === 5) {
      return res(ctx.status(200), ctx.json(categoriesOffset5));
    }

    if (offset === 5 && limit === 10) {
      return res(ctx.status(200), ctx.json(categoriesOffset5Limit10));
    }

    if (offset === 10 && limit === 5) {
      return res(ctx.status(200), ctx.json(categoriesOffset10));
    }

    if (offset === 10 && limit === 2) {
      return res(ctx.status(200), ctx.json(categoriesOffset10Limit2));
    }

    return res(ctx.status(200), ctx.json(categoriesOffset0));
  }
);
