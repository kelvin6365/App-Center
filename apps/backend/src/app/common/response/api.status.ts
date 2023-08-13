import { ApiProperty } from '@nestjs/swagger';
import { ResponseCode } from './response.code';
import { ResponseStatus } from './response.status';

export class ApiStatus {
  @ApiProperty()
  private readonly code: number;
  @ApiProperty()
  private readonly systemMessage: string;
  @ApiProperty()
  private readonly displayMessage: string | string[];
  @ApiProperty()
  private readonly t: Date;

  constructor(rspStatus: ResponseStatus) {
    if (rspStatus != null) {
      this.code = rspStatus.getCode;
      this.systemMessage = rspStatus.getSystemMessage;
      this.displayMessage = rspStatus.getDisplayMessage;
    } else {
      this.code = ResponseCode.STATUS_1000_SUCCESS.getCode;
      this.systemMessage = ResponseCode.STATUS_1000_SUCCESS.getSystemMessage;
      this.displayMessage = ResponseCode.STATUS_1000_SUCCESS.getDisplayMessage;
    }
    this.t = new Date();
  }

  get getCode(): number {
    return this.code;
  }

  get getSystemMessage(): string {
    return this.systemMessage;
  }
  get getDisplayMessage(): string | string[] {
    return this.displayMessage;
  }

  get getT(): Date {
    return this.t;
  }
}
