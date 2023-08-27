import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EmailVerifyRequestDTO {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  token: string;
}
