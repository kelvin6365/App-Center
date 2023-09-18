import { DBConfig } from './db.config';

export default () => ({
  app: {
    name: 'api-service',
    appPort: process.env.PORT,
    swaggerPath: process.env.SWAGGER_PATH,
    env: process.env.ENV,
  },
  db: {
    ...new DBConfig().config,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    user: {
      accessTokenExpiresIn: process.env.JWT_USER_ACCESS_TOKEN_EXPIRES_IN || 30,
      refreshTokenExpiresIn:
        process.env.JWT_USER_REFRESH_TOKEN_EXPIRES_IN || 60,
    },
  },
  services: {
    redis: {
      enabled: false,
    },
    file: {
      bucketName: process.env.BUCKET_NAME,
      spaceKey: process.env.BUCKET_KEY,
      secret: process.env.BUCKET_SECRET,
      endpoint: process.env.BUCKET_ENDPOINT,
      region: process.env.BUCKET_REGION,
      fileAPI: process.env.FILE_API,
      publicAPI: process.env.PUBLIC_API,
    },
  },
  static: {},
});
