import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { ResponseStatus } from '../response/response.status';
import { AppException } from '../response/app.exception';
import { AppResponse } from '../response/app.response';
import { ResponseCode } from '../response/response.code';
import { isArray } from 'class-validator';

@Catch()
@Injectable({ scope: Scope.REQUEST })
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status, responseStatus;
    switch (true) {
      case exception instanceof AppException:
        status = exception.getStatus();
        responseStatus = exception.getResponseStatus;
        this.logger.error(
          `[${AppExceptionFilter.name}] AppException : ${JSON.stringify(
            responseStatus
          )}`
        );
        break;
      case exception instanceof ForbiddenException:
        status = exception.getStatus();
        responseStatus = ResponseCode.STATUS_8003_PERMISSION_DENIED;
        this.logger.error(
          `[${AppExceptionFilter.name}] ForbiddenException ${JSON.stringify(
            responseStatus
          )}`
        );
        break;

      case exception instanceof UnauthorizedException:
        status = exception.getStatus();
        responseStatus = ResponseCode.STATUS_8000_UNAUTHORIZED;
        this.logger.error(
          `[${AppExceptionFilter.name}] UnauthorizedException ${JSON.stringify(
            responseStatus
          )}`
        );
        break;

      case exception instanceof TypeError:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        responseStatus = new ResponseStatus(
          exception.getStatus,
          exception.name,
          exception.message
        );
        console.log(exception);
        this.logger.error(
          `[${AppExceptionFilter.name}] TypeError Exception ${JSON.stringify(
            exception
          )}`,
          exception
        );
        break;

      case exception instanceof Error:
        console.log(exception);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        // eslint-disable-next-line no-case-declarations
        const responseMessages = exception.getResponse
          ? exception.getResponse().message
          : exception.toString();
        responseStatus = new ResponseStatus(
          exception.getStatus ? exception.getStatus() : 500,
          exception.getResponse
            ? exception.getResponse().error
            : exception.toString(),
          isArray(responseMessages) ? responseMessages : [responseMessages]
        );
        this.logger.error(
          `[${AppExceptionFilter.name}] Error Exception `,
          exception
        );
        break;

      default:
        status = exception.getStatus();
        responseStatus = ResponseCode.STATUS_9000_BAD_REQUEST;
        this.logger.error(
          `[${AppExceptionFilter.name}] Unknown Exception`,
          exception.stack
        );
        break;
    }
    response
      .status(status)
      .json(
        new AppResponse(
          null,
          responseStatus
            ? responseStatus
            : ResponseCode.STATUS_9002_SYSTEM_ERROR
        )
      );
  }
}
