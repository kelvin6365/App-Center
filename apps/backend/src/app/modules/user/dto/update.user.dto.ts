import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @ValidateIf((data) => data.password)
  @IsNotEmpty()
  oldPassword: string;
}
