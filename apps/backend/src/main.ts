/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ServerModule } from './app/server.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { isMatchPassword } from './app/common/util/password.util';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  const configService: ConfigService = app.get(ConfigService); //Get Config Service

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('App Center')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    configService.get<string>('app.swaggerPath') ?? 'api/swagger',
    app,
    document
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `🚀 Swagger is running on: http://localhost:${port}/${
      configService.get<string>('app.swaggerPath') ?? 'api/swagger'
    }`
  );
}

bootstrap();
