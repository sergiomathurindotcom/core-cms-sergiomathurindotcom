export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      // Session will expire after 30 days of inactivity
      maxSessionLifespan: 1000 * 60 * 60 * 24 * 30, // 30 days in milliseconds
      // Refresh token will expire after 90 days
      maxRefreshTokenLifespan: 1000 * 60 * 60 * 24 * 90, // 90 days in milliseconds
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});
