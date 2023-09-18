import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { MetaDTO } from '../dto/meta.dto';
import { PageDto } from '../dto/page.dto';
import { AppResponse } from '../response/app.response';

export function ApiPagingResponseSchema(
  httpStatus: number,
  description: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataDto: any
) {
  const httpStatusDecorator = [
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' }),
  ];

  return applyDecorators(
    ApiExtraModels(AppResponse, PageDto, dataDto, MetaDTO),
    ApiOkResponse({
      status: httpStatus,
      description: description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(AppResponse) },
          {
            properties: {
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(dataDto) },
                  },
                  meta: { $ref: getSchemaPath(MetaDTO) },
                },
              },
            },
          },
        ],
      },
    }),
    ...httpStatusDecorator
  );
}
