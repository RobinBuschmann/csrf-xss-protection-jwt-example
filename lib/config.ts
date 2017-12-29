export const config = {
  environment: process.env.ENV || 'dev',
  jwt: {
    secret: process.env.JWT_secret || 'test',
    issuer: process.env.JWT_ISSUER || require('../package.json').name,
    expiresIn: process.env.JWT_EXPIRES_IN || '20m',
    cookieKey: 'jwt',
    csrfHeaderKey: 'x-csrf-token'
  }
};
