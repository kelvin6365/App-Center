import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class PatchAppDTO {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
