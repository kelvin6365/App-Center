import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAppVersionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      const values = value.split(',');
      return values;
    }
    return [];
  })
  tags!: string[];

  //install password
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  installPassword: string;
}
