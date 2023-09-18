import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Length,
  validateSync,
} from 'class-validator';

enum Environment {
  Local = 'local',
  Production = 'prod',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  SWAGGER_PATH: string;

  @IsString()
  TZ: string;

  //[Database]
  @IsString()
  TYPEORM_URL: string;
  @IsString()
  TYPEORM_SYNCHRONIZE: string;
  @IsBoolean()
  TYPEORM_LOGGING: boolean;
  @IsString()
  TYPEORM_MIGRATIONS: string;
  @IsString()
  TYPEORM_MIGRATIONS_DIR: string;
  @IsBoolean()
  TYPEORM_MIGRATIONS_RUN: boolean;

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
  @IsString()
  FILE_API: string;
  @IsString()
  PUBLIC_API: string;

  //[JWT]
  @IsString()
  JWT_SECRET: string;

  //[Encryption]
  @IsString()
  PASSPHRASE: string;

  @IsString()
  @Length(64)
  KEY: string;

  //   //[Default Admin]
  //   @IsBoolean()
  //   DEFAULT_ADMIN_ENABLED: boolean;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_ADMIN_ENABLED;
  //   })
  //   @IsString()
  //   DEFAULT_ADMIN: string;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_ADMIN_ENABLED;
  //   })
  //   @IsString()
  //   @IsEmail()
  //   DEFAULT_ADMIN_USERNAME: string;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_ADMIN_ENABLED;
  //   })
  //   @IsString()
  //   DEFAULT_ADMIN_PASSWORD: string;

  //   //[Default tenant]
  //   @IsBoolean()
  //   DEFAULT_TENANT_ENABLED: boolean;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_TENANT_ENABLED;
  //   })
  //   @IsString()
  //   DEFAULT_TENANT: string;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_TENANT_ENABLED;
  //   })
  //   @IsString()
  //   DEFAULT_TENANT_DOMAINNAME: string;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_TENANT_ENABLED;
  //   })
  //   @IsString()
  //   @IsEmail()
  //   DEFAULT_TENANT_USERNAME: string;

  //   @ValidateIf((obj) => {
  //     return obj.DEFAULT_TENANT_ENABLED;
  //   })
  //   @IsString()
  //   DEFAULT_TENANT_PASSWORD: string;
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
