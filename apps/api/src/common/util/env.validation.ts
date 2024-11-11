import { Transform, plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Local = 'local',
  Uat = 'uat',
  Dev = 'dev',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  ENV: Environment;

  @IsNumber()
  @Transform(({ value }: { value: string }) => {
    return +value;
  })
  PORT: number;

  @IsString()
  SWAGGER_PATH: string;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string;
  @IsString()
  @IsOptional()
  GLOBAL_PREFIX: string;

  //[Database]
  @IsString()
  TYPEORM_URL: string;
  @IsString()
  TYPEORM_SYNCHRONIZE: string;
  @IsBoolean()
  @Transform(({ value }: { value: string }) => {
    return Boolean(value);
  })
  TYPEORM_LOGGING: boolean;
  @IsString()
  TYPEORM_MIGRATIONS: string;
  @IsString()
  TYPEORM_MIGRATIONS_DIR: string;
  @IsBoolean()
  @Transform(({ value }: { value: string }) => {
    return Boolean(value);
  })
  TYPEORM_MIGRATIONS_RUN: boolean;

  // // Redis
  // @IsString()
  // REDIS_HOST: string;
  // @IsNumber()
  // @Min(0)
  // @Max(65535)
  // @Transform(({ value }: { value: string }) => {
  //   return +value;
  // })
  // REDIS_PORT: number;
  // @IsString()
  // REDIS_USERNAME: string;
  // @IsString()
  // REDIS_PASSWORD: string;
  // @IsString()
  // REDIS_TLS_ENABLE: string;

  //[Services]

  @IsString()
  @IsOptional()
  EMAIL_SENDER: string;
  @IsString()
  @IsOptional()
  EMAIL_HOST: string;
  @IsString()
  @IsOptional()
  EMAIL_PASSWORD: string;

  //[JWT]
  @IsString()
  JWT_SECRET: string;

  //[Storage]
  @IsString()
  BUCKET_KEY: string;
  @IsString()
  BUCKET_SECRET: string;
  @IsString()
  BUCKET_NAME: string;
  @IsString()
  BUCKET_ENDPOINT: string;
  @IsString()
  BUCKET_REGION: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
