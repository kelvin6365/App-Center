import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { AppVersionTag } from '../../modules/app/entities/app.version.tag.entity';
import { plainToInstance } from 'class-transformer';
import { camelCase } from 'lodash';
@Injectable()
export class AppVersionTagRepository extends Repository<AppVersionTag> {
  constructor(dataSource: DataSource) {
    super(AppVersionTag, dataSource.createEntityManager());
  }

  //get all tags by app id and group by tag name
  async getAllTagsByAppId(
    appId: string,
    withDeleted = false
  ): Promise<AppVersionTag[]> {
    const query = this.createQueryBuilder('appVersionTag')
      .select()
      .distinctOn(['name'])
      .where({ appId: appId })
      .orderBy('name', 'ASC');
    if (withDeleted) {
      query.withDeleted();
    }
    const result = await query.getRawMany();
    return result.map((tag) => {
      const newTag = {};
      Object.keys(tag).map(
        (key) =>
          (newTag[camelCase(key.replace('appVersionTag', ''))] = tag[key])
      );
      return plainToInstance(AppVersionTag, newTag);
    });
  }

  //get all tags by app version id
  getAllTagsByAppVersionId(
    appVersionId: string,
    withDeleted = false
  ): Promise<AppVersionTag[]> {
    return this.find({ where: { appVersionId: appVersionId }, withDeleted });
  }
}
