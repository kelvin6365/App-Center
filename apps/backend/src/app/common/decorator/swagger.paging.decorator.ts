// import { applyDecorators, HttpStatus } from '@nestjs/common';
// import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
// import { AppResponse } from '../response/app.response';
// import { PageDto } from '../dto/page.dto';
// import { MetaDTO } from '../dto/meta.dto';

// export function ApiPagingResponseSchema(
//   httpStatus: number,
//   description: string,
//   dataDto: any
// ) {
//   const httpStatusDecorator = [];

//   httpStatusDecorator.push(
//     ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
//   );

//   return applyDecorators(
//     ApiResponse({
//       status: httpStatus,
//       description: description,
//       schema: {
//         allOf: [
//           {
//             $ref: getSchemaPath(AppResponse),
//             properties: {
//               data: {
//                 $ref: getSchemaPath(PageDto<typeof dataDto>),
//               },
//             },
//           },
//           {
//             properties: {
//               data: {
//                 properties: {
//                   // items: {
//                   //   $ref: getSchemaPath(dataDto),
//                   //   type: 'array',
//                   // },
//                   items: {
//                     type: 'array',
//                     $ref: getSchemaPath(dataDto),
//                     properties: {
//                       sss: {
//                         type: 'string',
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         ],
//       },
//     }),
//     ApiExtraModels(AppResponse, PageDto<typeof dataDto>),
//     ...httpStatusDecorator
//   );
// }
