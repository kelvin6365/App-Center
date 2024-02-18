import { Injectable } from '@nestjs/common';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { File } from '../../modules/file/entities/file.entity';

@Injectable()
export class FileRepository extends Repository<File> {
  constructor(dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }

  //create file
  async createFile(file: File): Promise<File> {
    return this.create(await this.save(file));
  }

  //get file by id
  async getFileById(id: string, withDeleted = false): Promise<File> {
    return await this.findOne({ where: { id }, withDeleted });
  }

  //delete file
  async deleteFile(id: string, updatedBy?: string): Promise<DeleteResult> {
    if (updatedBy) {
      await this.update(id, { updatedBy });
    }
    return await this.softDelete({ id });
  }
}
