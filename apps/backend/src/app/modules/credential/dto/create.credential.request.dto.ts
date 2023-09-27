import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCredentialRequestDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  credentialName: string;
  @ApiProperty({
    type: JSON,
  })
  @Transform(({ value }) => {
    return JSON.stringify(value);
  })
  @IsString()
  encryptedData: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  tenantId: string;
}
