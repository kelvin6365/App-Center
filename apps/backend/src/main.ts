import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ServerModule } from './app/server.module';

async function bootstrap() {
  const app = await NestFactory.create(ServerModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    origin: ['http://localhost'],
    credentials: true,
  });
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
    .addBearerAuth()
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
    `🚀 Swagger is running on: http://localhost:${port}${
      configService.get<string>('app.swaggerPath') ?? 'api/swagger'
    }`
  );
}

bootstrap();
