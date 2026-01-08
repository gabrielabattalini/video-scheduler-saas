import type { Secret, SignOptions } from 'jsonwebtoken';

export const jwtConfig: {
  accessTokenSecret: Secret;
  refreshTokenSecret: Secret;
  accessTokenExpiry: SignOptions['expiresIn'];
  refreshTokenExpiry: SignOptions['expiresIn'];
} = {
  accessTokenSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
};
