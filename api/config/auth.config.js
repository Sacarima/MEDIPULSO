export const authConfig = {
    secret: process.env.JWT_SECRET_TOKEN || 'testsecret',
    jwtExpiration: 3600,           // 1 hour (in seconds)
    jwtRefreshExpiration: 604800,   // 7 days (in seconds)
  }