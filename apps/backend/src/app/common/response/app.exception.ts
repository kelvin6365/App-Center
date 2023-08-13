import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseStatus } from './response.status';

export class AppException extends HttpException {
  private readonly responseStatus;
  private readonly exception;
  constructor(
    _responseStatus: ResponseStatus,
    exception?: unknown,
    status?: number
  ) {
    super(null, status ? status : HttpStatus.BAD_REQUEST);
    this.responseStatus = _responseStatus;
    this.exception = exception;
  }
  get getResponseStatus(): ResponseStatus {
    return this.responseStatus;
  }
  get getException(): unknown {
    return this.exception;
  }
}
