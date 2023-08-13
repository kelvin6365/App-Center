import { Injectable } from '@nestjs/common';
import {
  DataSource,
  DeleteResult,
  FindManyOptions,
  FindOptionsOrder,
  ILike,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { AppVersion } from '../../modules/app/entities/app.version.entity';
import { App } from '../../modules/app/entities/app.entity';

@Injectable()
export class AppVersionRepository extends Repository<AppVersion> {
  constructor(dataSource: DataSource) {
    super(AppVersion, dataSource.createEntityManager());
  }

  //Get all files belonging to an app
  getAllAppVersions(
    appId: string,
    searchQuery = '',
    withDeleted = false,
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ]
  ): Promise<AppVersion[]> {
    let findOptions: FindManyOptions<AppVersion> = {};
    findOptions = {
      where: [],
      withDeleted,
      order: {},
      relations: ['file'],
    };
    const orWhereOptions = [
      {
        appId,
        name: ILike(`%${searchQuery}%`),
      },
      {
        appId,
        description: ILike(`%${searchQuery}%`),
      },
    ];
    if (filters.length > 0) {
      const relations = filters.reduce(function (r, o) {
        const path = o.key.split('.'),
          last = path.pop();
        path.reduce(function (p, k) {
          return (p[k] = p[k] || {});
        }, r)[last] = Array.isArray(o.values)
          ? In(o.values)
          : ILike(`%${o.values}%`);
        return r;
      }, {});
      findOptions.where = orWhereOptions.map((o) => ({ ...o, ...relations }));
    } else {
      findOptions.where = orWhereOptions;
    }
    if (sorts.length > 0) {
      for (let i = 0; i < sorts.length; i++) {
        const sort = sorts[i];
        findOptions.order[sort.key] = sort.value;
      }
    }
    return this.find(findOptions);
  }

  //Get a single file
  getAppVersion(id: string, withDeleted = false): Promise<AppVersion> {
    return this.findOne({ where: { id }, withDeleted });
  }

  //Create a new file
  createAppVersion(file: AppVersion): Promise<AppVersion> {
    return this.save(file);
  }

  //Delete a file
  deleteAppVersion(id: string): Promise<DeleteResult> {
    return this.softDelete({ id });
  }

  //AppVersion save
  updateAppVersion(file: AppVersion): Promise<AppVersion> {
    return this.save(file);
  }
}
