import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class InstallAppRequestDTO {
  @ApiProperty()
  @IsString()
  password: string;
}
