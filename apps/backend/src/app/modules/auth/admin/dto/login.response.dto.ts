import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDTO {
  @ApiProperty()
  accessToken: string;
  // @ApiProperty()
  // refreshToken: string;
  @ApiProperty()
  accessTokenExpires: Date;

  constructor(
    accessToken: string,
    // refreshToken: string,
    accessTokenExpires: Date
  ) {
    this.accessToken = accessToken;
    // this.refreshToken = refreshToken;
    this.accessTokenExpires = accessTokenExpires;
  }
}
