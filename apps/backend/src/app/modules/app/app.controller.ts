import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import * as mime from 'mime-types';
import 'multer';
import { Readable } from 'typeorm/platform/PlatformTools';
import { JSONQuery } from '../../common/decorator/json.query';
import { ApiResponseSchema } from '../../common/decorator/swagger.decorator';
import { PageDto } from '../../common/dto/page.dto';
import { SearchQueryDTO } from '../../common/dto/search.dto';
import { AppException } from '../../common/response/app.exception';
import { AppResponse } from '../../common/response/app.response';
import { ResponseCode } from '../../common/response/response.code';
import { AppAllowedType } from '../file/enum/app.allowed.type.enum';
import { ImageAllowedType } from '../file/enum/image.allowed.type.enum';
import { FileService } from '../file/file.service';
import { AppService } from './app.service';
import { AppDTO } from './dto/app.dto';
import { CreateAppDTO } from './dto/create.app.dto';
import { CreateAppVersionDTO } from './dto/create.app.version.dto';
import { InstallAppDTO } from './dto/install.app.dto';
import { InstallAppRequestDTO } from './dto/install.app.request.dto';
import { UpdateAppDTO } from './dto/update.app.dto';

@ApiTags('App')
@Controller({ path: 'app', version: ['1'] })
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService
  ) {}

  //Get a list of apps with search query, tags and sorting
  @Get('search')
  @ApiQuery({
    name: 'query',
    required: false,
    description: `
    {
      "query": "s",
      "filters": [
        { "key": "id", "values": ["aaedaf21-5ef5-42a9-a882-c2c336c56b99"] }
      ],
      "sorts": [
        { "key": "id", "value": "ASC" }
      ],
      "withDeleted": true
    }`,
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponseSchema(HttpStatus.OK, 'OK', PageDto<AppDTO>)
  async getApps(
    @JSONQuery('query') query: SearchQueryDTO,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.appService.findAll(
        query?.query ?? '',
        query?.withDeleted != null ? query.withDeleted : false,
        page,
        limit,
        query?.filters ?? [],
        query?.sorts ?? [{ key: 'createdAt', value: 'DESC' }]
      )
    );
  }

  //Get a single app
  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  async getApp(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<AppResponse> {
    return new AppResponse(await this.appService.findById(id));
  }

  //Create a new app
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          Object.keys(ImageAllowedType)
            .map((t) => t.toLocaleLowerCase())
            .indexOf(
              (mime.extension(file.mimetype) as string).toLocaleLowerCase()
            ) !== -1
        ) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new AppException(
              ResponseCode.STATUS_7000_UNSUPPORTED_FILE_TYPE(file.mimetype),
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
    })
  )
  async createApp(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      })
    )
    file: Express.Multer.File,
    @Body() app: CreateAppDTO
  ): Promise<AppResponse> {
    return new AppResponse(await this.appService.createApp(app, file));
  }

  //Update an existing app
  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('icon', {
      limits: {
        files: 1,
        fileSize: 1024 * 1024,
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          Object.keys(ImageAllowedType)
            .map((t) => t.toLocaleLowerCase())
            .indexOf(
              (mime.extension(file.mimetype) as string).toLocaleLowerCase()
            ) !== -1
        ) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new AppException(
              ResponseCode.STATUS_7000_UNSUPPORTED_FILE_TYPE(file.mimetype),
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
    })
  )
  async updateApp(
    @Param('id') id,
    @UploadedFile()
    file: Express.Multer.File,
    @Body() updateApp: UpdateAppDTO
  ): Promise<AppResponse> {
    console.log(file, updateApp, id);
    return new AppResponse(
      await this.appService.updateApp(id, updateApp, file)
    );
  }

  //Delete an existing app
  @Delete(':id')
  async deleteApp(@Param('id') id): Promise<any> {
    // return this.appService.deleteApp(id);
  }

  //Get a single app with all its versions. support filtering by tags
  @Get(':id/version/search')
  @ApiQuery({
    name: 'query',
    required: false,
    description: `
    {
      "query": "s",
      "filters": [
        { "key": "id", "values": ["aaedaf21-5ef5-42a9-a882-c2c336c56b99"] }
      ],
      "sorts": [
        { "key": "id", "value": "ASC" }
      ],
      "withDeleted": true
    }`,
  })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getAppVersions(
    @JSONQuery('query') query: SearchQueryDTO,
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.appService.getAllAppVersions(
        id,
        query?.query ?? '',
        query?.withDeleted != null ? query.withDeleted : false,
        query?.filters ?? [],
        query?.sorts ?? [{ key: 'createdAt', value: 'DESC' }]
      )
    );
  }

  //Add new version to an existing app
  @Post(':id/version')
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        files: 1,
      },
      fileFilter: (req: any, file: any, cb: any) => {
        if (
          Object.keys(AppAllowedType)
            .map((t) => t.toLocaleLowerCase())
            .indexOf(
              (mime.extension(file.mimetype) as string).toLocaleLowerCase()
            ) !== -1 ||
          Object.keys(AppAllowedType)
            .map((t) => t.toLocaleLowerCase())
            .indexOf(file.originalname.split('.').pop().toLocaleLowerCase()) !==
            -1
        ) {
          // Allow storage of file
          cb(null, true);
        } else {
          // Reject file
          cb(
            new AppException(
              ResponseCode.STATUS_7000_UNSUPPORTED_FILE_TYPE(file.mimetype),
              HttpStatus.BAD_REQUEST
            ),
            false
          );
        }
      },
    })
  )
  async addVersion(
    @Param('id') id,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
      })
    )
    file: Express.Multer.File,
    @Body() appVersion: CreateAppVersionDTO
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.appService.createAppVersion(id, appVersion, file)
    );
  }

  //get all app version tags by app id
  @Get(':id/version/tags')
  @ApiParam({ name: 'id', required: true })
  async getAllAppVersionTags(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<AppResponse> {
    return new AppResponse(await this.appService.getAllAppVersionTags(id));
  }

  //get API key by app id
  @Get(':id/api-key')
  @ApiParam({ name: 'id', required: true })
  @ApiResponseSchema(HttpStatus.OK, 'OK')
  async getApiKey(
    @Param('id', new ParseUUIDPipe()) id: string
  ): Promise<AppResponse> {
    return new AppResponse(await this.appService.getApiKey(id));
  }

  //Get App by ID for installing
  @Post(':id/version/:versionId/install')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'versionId', required: true })
  @ApiResponseSchema(HttpStatus.OK, 'OK', InstallAppDTO)
  async getInstallApp(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('versionId', new ParseUUIDPipe()) versionId: string,
    @Body() dto: InstallAppRequestDTO
  ): Promise<AppResponse> {
    return new AppResponse(
      await this.appService.getInstallApp(id, versionId, dto.password)
    );
  }

  @Get(':id/version/:versionId/install')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'versionId', required: true })
  @ApiQuery({ name: 'password', required: true })
  async install(
    @Query('password') password: string,
    @Param('versionId') versionId: string,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Res() res: Response
  ) {
    await this.appService.findById(id, false, true);
    const appVersion = await this.appService.validateInstallPassword(
      versionId,
      password
    );
    const [file, s3Item] = await this.fileService.getFileByFileUUID(
      appVersion.fileId
    );
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
    res.set({
      'Content-Disposition': `attachment; filename="${file.name}"`,
    });
    return (s3Item.Body as Readable).pipe(res);
  }

  //delete app version
  @Delete(':id/version/:versionId')
  @ApiParam({ name: 'id', required: true })
  @ApiParam({ name: 'versionId', required: true })
  async deleteAppVersion(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('versionId', new ParseUUIDPipe()) versionId: string
  ) {
    return new AppResponse(
      await this.appService.deleteAppVersion(id, versionId)
    );
  }
}
