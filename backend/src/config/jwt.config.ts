export const jwtConfig = {
  accessTokenSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
};
