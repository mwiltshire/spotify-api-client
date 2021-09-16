import { rest } from 'msw';

const accessTokenResponse = {
  access_token: 'NgCXRKFjj4fJdj4g9i2kd9FLMzYjw',
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600,
  refresh_token: 'NgAagA49DK498hvmiRi8chUm_SHo'
};

const refreshTokenResponse = {
  access_token: 'NgA6ZcYIfj883fk3ixn8bUQ',
  token_type: 'Bearer',
  scope: 'user-read-private user-read-email',
  expires_in: 3600
};

export const auth = rest.post<string>(
  'https://accounts.spotify.com/api/token',
  (req, res, ctx) => {
    const params = new URLSearchParams(req.body);

    const code = params.get('code');
    const grant_type = params.get('grant_type');
    const redirect_uri = params.get('redirect_uri');
    const refresh_token = params.get('refresh_token');

    if (
      code === 'AUTH_CODE_FLOW' &&
      grant_type === 'authorization_code' &&
      redirect_uri === 'https://test.com/callback'
    ) {
      const authHeader = req.headers.get('Authorization');

      if (
        authHeader ===
        `Basic ${Buffer.from('CLIENT_ID:CLIENT_SECRET').toString('base64')}`
      ) {
        return res(ctx.json(accessTokenResponse));
      }
    }

    if (grant_type === 'refresh_token' && refresh_token) {
      return res(ctx.json(refreshTokenResponse));
    }

    return res(ctx.status(400), ctx.json({ error: 'BAD REQUEST' }));
  }
);
