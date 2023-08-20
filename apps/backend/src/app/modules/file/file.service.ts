import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { FileType } from './enum/file.type.enum';
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  ObjectCannedACL,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';
import { FileRepository } from '../../database/repositories/file.repository';
import { File } from './entities/file.entity';
import { FileStatus } from './enum/file.status.enum';
import imageThumbnail from 'image-thumbnail';

@Injectable()
export class FileService {
  private s3Client: S3Client;
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly configService: ConfigService,
    private readonly fileRepository: FileRepository
  ) {
    this.logger = new Logger('FileService');
    this.s3Client = new S3Client({
      forcePathStyle: false, // Configures to use subdomain/virtual calling format.
      endpoint: this.configService.get<string>('services.file.endpoint'),
      region: this.configService.get<string>('services.file.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('services.file.spaceKey'),
        secretAccessKey: this.configService.get<string>('services.file.secret'),
      },
    });
  }

  //delete file
  async deleteFile(id: string): Promise<boolean> {
    const res = await this.fileRepository.deleteFile(id);
    return res ? true : false;
  }

  async getFileByFileUUID(id: string): Promise<[File, GetObjectCommandOutput]> {
    const file: File = await this.fileRepository.getFileById(id);
    if (!file) {
      return [null, null];
    }
    const options: GetObjectCommand = new GetObjectCommand({
      Key: `${file.key}`,
      Bucket: this.configService.get<string>('services.file.bucketName'),
    });
    try {
      const s3Item = await this.s3Client.send(options);
      return [file, s3Item];
    } catch (error) {
      return [file, null];
    }
  }

  async uploadAppIcon(
    appId: string,
    file: Express.Multer.File,
    userId: string
  ): Promise<File> {
    try {
      const filePath = `app/${appId}/cover_image_${new Date().getTime()}.${mime.extension(
        file.mimetype
      )}`;
      //Origin
      const successUploadFile = await this.save(
        true,
        filePath,
        file.mimetype,
        file.buffer,
        [
          {
            id: appId,
            type: FileType.APP_ICON,
          },
        ],
        userId,
        FileType.APP_ICON,
        ObjectCannedACL.public_read,
        {
          percentage: 80,
          width: 520,
          height: 520,
          fit: 'cover',
          responseType: 'buffer',
        }
      );

      return successUploadFile;
    } catch (error) {
      this.logger.error(
        `uploadVideoCoverImage Fail! ${JSON.stringify(error)}`,
        error
      );
    }
  }

  async unloadAppFile(
    appId: string,
    file: Express.Multer.File,
    userId: string
  ) {
    try {
      const fileExtension = file.originalname.split('.').pop();
      const filePath = `app/${appId}/${file.originalname
        .split('.')
        .slice(0, -1)
        .join('.')}-${new Date().getTime()}.${fileExtension}`;
      const object = [
        {
          id: appId,
          type: FileType.APP_ICON,
        },
      ].reduce((obj, item) => Object.assign(obj, item), {});
      const params: PutObjectCommandInput = {
        Bucket: this.configService.get<string>('services.file.bucketName'),
        Key: filePath,
        Body: file.buffer,
        Metadata: object,
        ContentType: file.mimetype,
        ACL: ObjectCannedACL.public_read,
      };
      await this.s3Client.send(new PutObjectCommand(params));
      this.logger.log(`[FileService] Upload Success Path : ${filePath}`);
      const newFile: File = new File();
      newFile.key = filePath;
      newFile.type =
        fileExtension === 'apk' ? FileType.ANDROID_APP : FileType.IOS_APP;
      newFile.status = FileStatus.SUCCESS;
      newFile.contentType = file.mimetype;
      newFile.extension = fileExtension;
      newFile.name = file.originalname;
      newFile.createdBy = userId ?? null;

      return await this.fileRepository.createFile(newFile);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async save(
    isPublic: boolean,
    path: string,
    contentType: string,
    media: Buffer,
    metadata: { [key: string]: string }[],
    uploadUserId: string = null,
    type: string,
    ACL: ObjectCannedACL,
    options?: {
      responseType: 'buffer';
      fit: 'cover';
    } & imageThumbnail.Options
  ): Promise<File> {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});

    try {
      if (options) {
        const thumbnail = await imageThumbnail(media, options);
        const params: PutObjectCommandInput = {
          Bucket: this.configService.get<string>('services.file.bucketName'),
          Key: path,
          Body: thumbnail,
          Metadata: object,
          ContentType: contentType,
          ACL,
        };
        await this.s3Client.send(new PutObjectCommand(params));
      } else {
        const params: PutObjectCommandInput = {
          Bucket: this.configService.get<string>('services.file.bucketName'),
          Key: path,
          Body: media,
          Metadata: object,
          ContentType: contentType,
          ACL,
        };
        await this.s3Client.send(new PutObjectCommand(params));
      }

      this.logger.log(`[FileService] Upload Success Path : ${path}`);
      const newFile: File = new File();
      newFile.isPublic = isPublic;
      newFile.key = path;
      newFile.type = type;
      newFile.status = FileStatus.SUCCESS;
      newFile.contentType = contentType;
      newFile.extension = mime.extension(contentType) as string;
      newFile.createdBy = uploadUserId ?? null;

      return await this.fileRepository.createFile(newFile);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
