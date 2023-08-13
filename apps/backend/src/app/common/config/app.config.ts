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
  },
  services: {
    file: {
      bucketName: process.env.BUCKET_NAME,
      spaceKey: process.env.BUCKET_KEY,
      secret: process.env.BUCKET_SECRET,
      endpoint: process.env.BUCKET_ENDPOINT,
      region: process.env.BUCKET_REGION,
      fileAPI: process.env.FILE_API,
    },
  },
  static: {},
});
