import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Readable } from 'typeorm/platform/PlatformTools';
import { Public } from '../../common/decorator/public';
import { AppResponse } from '../../common/response/app.response';
import { ResponseCode } from '../../common/response/response.code';
import { FileService } from './file.service';

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
    if (!file.isPublic) {
      return res
        .status(400)
        .json(new AppResponse(null, ResponseCode.STATUS_8000_UNAUTHORIZED));
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
