import { Injectable } from '@nestjs/common';
import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { DataSource, FindManyOptions, ILike, In, Repository } from 'typeorm';
import { App } from '../../modules/app/entities/app.entity';

@Injectable()
export class AppRepository extends Repository<App> {
  constructor(dataSource: DataSource) {
    super(App, dataSource.createEntityManager());
  }

  //Get All Apps
  async findAll(
    tenantIds: string[],
    searchQuery = '',
    withDeleted = false,
    options: IPaginationOptions = { page: 1, limit: 10 },
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ]
  ): Promise<Pagination<App, IPaginationMeta>> {
    let findOptions: FindManyOptions<App> = {};
    findOptions = {
      where: [],
      withDeleted,
      order: {},
      relations: [],
    };
    const orWhereOptions = [
      {
        name: ILike(`%${searchQuery}%`),
      },
      {
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
    findOptions.where = findOptions.where.map((o) => {
      const filterByTenant = filters.find((f) => f.key === 'tenantId');
      if (filterByTenant) {
        const values = filterByTenant.values as string[];
        return {
          ...o,
          tenantId: tenantIds
            ? In(
                tenantIds.filter(function (e) {
                  return values.indexOf(e) > -1;
                })
              )
            : In(['00000000-0000-0000-0000-000000000000']),
        };
      }
      return {
        ...o,
        tenantId: tenantIds
          ? In(tenantIds)
          : In(['00000000-0000-0000-0000-000000000000']),
      };
    });
    return await paginate<App>(this, options, findOptions);
  }

  //Get App by ID
  async findById(id: string, withDeleted = false): Promise<App> {
    return await this.findOne({ where: { id }, withDeleted });
  }

  //Create App
  async createApp(app: App): Promise<App> {
    return await this.save(app);
  }

  //Update App
  async updateApp(app: App): Promise<App> {
    return await this.save(app);
  }

  //Delete App
  async deleteApp(id: string): Promise<void> {
    await this.softDelete({ id });
  }

  //Get App by API Key
  async findByApiKey(apiKey: string, withDeleted = false): Promise<App> {
    return await this.findOne({ where: { apiKey }, withDeleted });
  }
}
