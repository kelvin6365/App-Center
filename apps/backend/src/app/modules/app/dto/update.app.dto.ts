import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateAppDTO {
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
  @IsUUID('4', { each: true })
  @Transform(({ value }) => {
    if (value) {
      const values = value.split(',');
      return values;
    }
    return [];
  })
  tags!: string[];

  //json object call extra
  @ApiProperty()
  @IsOptional()
  @IsObject()
  @Transform(({ value }) => {
    if (value) {
      const values = JSON.parse(value);
      return values;
    }
    return {};
  })
  extra: Record<string, unknown>;
}
