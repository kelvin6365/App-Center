import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { AppResponse } from '../response/app.response';

export function ApiResponseSchema(
  httpStatus: number,
  description: string,
  responseDTO?: any,
  ...extraModels: any[]
) {
  const httpStatusDecorator = [];

  httpStatusDecorator.push(
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  );

  return responseDTO
    ? applyDecorators(
        ApiResponse({
          status: httpStatus,
          description: description,
          schema: {
            allOf: [
              {
                $ref: getSchemaPath(AppResponse),
                properties: {
                  data: {
                    $ref: getSchemaPath(responseDTO),
                  },
                },
              },
            ],
          },
        }),
        ApiExtraModels(AppResponse, responseDTO, ...extraModels),
        ...httpStatusDecorator
      )
    : applyDecorators(
        ApiResponse({
          status: httpStatus,
          description: description,
          schema: {
            allOf: [
              {
                $ref: getSchemaPath(AppResponse),
              },
            ],
          },
        }),
        ApiExtraModels(AppResponse),
        ...httpStatusDecorator
      );
}
