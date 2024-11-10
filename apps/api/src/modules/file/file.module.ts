import { Logger, Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileRepository } from '../../database/repositories/file.repository';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [Logger, FileRepository, FileService],
  exports: [FileService],
})
export class FileModule {}
