import { ApiProperty } from '@nestjs/swagger';
import { ApiStatus } from './api.status';
import { ResponseCode } from './response.code';
import { ResponseStatus } from './response.status';

export class AppResponse<T = null> {
  @ApiProperty()
  private readonly status: ApiStatus;
  @ApiProperty()
  private readonly data: T | null | Record<string, never>;

  constructor(
    _data?: T | null | Record<string, never>,
    _rpsStatus?: ResponseStatus
  ) {
    this.status =
      _rpsStatus != null
        ? new ApiStatus(_rpsStatus)
        : new ApiStatus(ResponseCode.STATUS_1000_SUCCESS);
    this.data = _data;
  }

  get getStatus(): ApiStatus {
    return this.status;
  }
}
