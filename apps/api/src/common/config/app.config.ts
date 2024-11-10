import { DBConfig } from './db.config';

export default () => ({
  app: {
    name: 'api-service',
    appPort: process.env.PORT,
    swaggerPath: process.env.SWAGGER_PATH,
    env: process.env.ENV,
    globalPrefix: process.env.GLOBAL_PREFIX,
    corsOrigin: process.env.CORS_ORIGIN,
    portalURL: process.env.PORTAL_URL,
  },
  db: {
    ...new DBConfig().config,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    user: {
      timeFormats: process.env.JWT_TIME_FORMATS || 'days',
      accessTokenExpiresIn: process.env.JWT_USER_ACCESS_TOKEN_EXPIRES_IN || 30,
      refreshTokenExpiresIn:
        process.env.JWT_USER_REFRESH_TOKEN_EXPIRES_IN || 60,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
    slugify: {},
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY,
      endpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
    },
  },
  static: {
    freeLimit: {
      teamLimit: Number(process.env.FREE_TEAM_LIMIT) || 1,
      appLimit: Number(process.env.FREE_APP_LIMIT) || 1,
    },
    defaultTenant: {
      enabled: Boolean(process.env.DEFAULT_TENANT_ENABLED) || false,
      name: process.env.DEFAULT_TENANT,
      domainName: process.env.DEFAULT_TENANT_DOMAINNAME,
      username: process.env.DEFAULT_TENANT_USERNAME,
      password: process.env.DEFAULT_TENANT_PASSWORD,
    },
    defaultAdministrator: {
      enabled: Boolean(process.env.DEFAULT_ADMIN_ENABLED) || false,
      name: process.env.DEFAULT_ADMIN,
      username: process.env.DEFAULT_ADMIN_USERNAME,
      password: process.env.DEFAULT_ADMIN_PASSWORD,
    },
  },
});
