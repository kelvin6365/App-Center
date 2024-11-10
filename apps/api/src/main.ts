import {
  INestApplication,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { ServerModule } from './server.module';

const initSwagger = (
  app: INestApplication<any>,
  config: {
    title: string;
    description: string;
    version: string;
    path: string;
  },
) => {
  const _config = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .setVersion(config.version)
    .addBearerAuth()
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, _config);
  SwaggerModule.setup(config.path, app, document, {
    jsonDocumentUrl: 'swagger/json',
  });
  // Add global header parameter
  document.components.parameters = {
    ...document.components.parameters,
    'x-language': {
      name: 'x-language',
      in: 'header',
      description: 'Language preference for the response',
      schema: {
        type: 'string',
        default: 'en',
        example: 'zh-HK',
      },
    },
  };

  // Add the global parameter to all paths
  Object.values(document.paths).forEach((path) => {
    Object.values(path).forEach((method) => {
      method.parameters = [
        { $ref: '#/components/parameters/x-language' },
        ...(method.parameters || []),
      ];
    });
  });
};

async function bootstrap() {
  try {
    const app = await NestFactory.create(ServerModule);
    const configService: ConfigService = app.get(ConfigService); // Get Config Service
    const globalPrefix = configService.get<string>('app.globalPrefix') ?? '';
    Logger.log(`Cors Origin: ${configService.get<string>('app.corsOrigin')}`);
    app.enableCors({
      origin: configService.get<string>('app.corsOrigin')?.split(',') ?? [],
      credentials: true,
    });
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.setGlobalPrefix(globalPrefix);
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.use(cookieParser());
    app.enableShutdownHooks();
    initSwagger(app, {
      title: 'NestJS API Documentation',
      description: `${configService.get<string>('app.name') ?? ''} API Documentation`,
      version: '1.0.0',
      path: configService.get<string>('app.swaggerPath') ?? '/api/swagger',
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
    Logger.log(
      `🚀 Swagger is running on: http://localhost:${port}${
        configService.get<string>('app.swaggerPath') ?? 'api/swagger'
      }`,
    );
  } catch (error) {
    Logger.error('Application startup failed', error);
    process.exit(1); // Exit the process with failure
  }
}

bootstrap();
