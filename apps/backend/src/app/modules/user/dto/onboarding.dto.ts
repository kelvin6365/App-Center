import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class OnBoardingDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  tenantName: string;
}
