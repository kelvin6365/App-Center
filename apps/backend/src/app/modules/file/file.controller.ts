import { Controller, Get, ParseBoolPipe, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { FileService } from './file.service';
import { Public } from '../../common/decorator/public';
import { Readable } from 'typeorm/platform/PlatformTools';
import { AppResponse } from '../../common/response/app.response';
import { ResponseCode } from '../../common/response/response.code';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('File')
@Controller({ path: 'file', version: ['1'] })
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Public()
  @Get('')
  async findOne(
    @Query('id') id: string,
    @Query('download') download: string,
    @Res() res: Response
  ) {
    const [file, s3Item] = await this.fileService.getFileByFileUUID(id);
    if (!file) {
      return res
        .status(400)
        .json(new AppResponse(null, ResponseCode.STATUS_1011_NOT_FOUND));
    }
    if (!s3Item) {
      return res
        .status(400)
        .json(new AppResponse(null, ResponseCode.STATUS_9000_BAD_REQUEST));
    }
    res.contentType(file.contentType);
    if (download === 'true') {
      res.set({
        'Content-Disposition': `attachment; filename="${file.name}"`,
      });
    }
    return (s3Item.Body as Readable).pipe(res);
  }
}
