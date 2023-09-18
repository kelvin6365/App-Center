import {
  DataSource,
  FindManyOptions,
  ILike,
  In,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Admin } from '../../modules/admin/entities/admin.entity';
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { AdminStatus } from '../../modules/admin/enum/admin.status.enum';
import { PostgresErrorCode } from '../../common/enum/postgres.error.code.enum';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';

@Injectable()
export class AdminRepository extends Repository<Admin> {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    dataSource: DataSource
  ) {
    super(Admin, dataSource.createEntityManager());
  }

  //find admin by email for match password
  async findAdminByEmailWithPassword(
    email: string,
    withDeleted = false
  ): Promise<Admin> {
    return await this.findOne({
      select: [
        'id',
        'name',
        'email',
        'status',
        'password',
        'createdAt',
        'deletedAt',
        'updatedAt',
      ],
      where: { email: email },
      withDeleted,
    });
  }

  //Create a new admin
  async createAdmin(admin: Admin): Promise<Admin> {
    try {
      return await this.save(admin);
    } catch (error) {
      this.logger.error(error);
      switch (error.code) {
        case PostgresErrorCode.UniqueViolation:
          throw new AppException(ResponseCode.STATUS_8013_USER_ALREADY_EXIST);
        default:
          throw error;
      }
    }
  }

  //Find an admin by email
  async findAdminByEmail(email: string, withDeleted = false): Promise<Admin> {
    return await this.findOne({ where: { email: email }, withDeleted });
  }

  //Find an admin by id
  async findAdminById(id: string, withDeleted = false): Promise<Admin> {
    return await this.findOne({ where: { id: id }, withDeleted });
  }

  //Find All admins
  /**
   * Retrieves a paginated list of admin entities based on the provided search query, filters, and sorting options.
   *
   * @param searchQuery - A string representing the search query to filter the admin entities by name or description. (optional)
   * @param withDeleted - A boolean indicating whether to include deleted admin entities in the result. (optional)
   * @param options - An object containing the pagination options like page number and limit. (optional)
   * @param filters - An array of objects representing the filters to apply on the admin entities. Each filter object contains a `key` representing the property to filter on and `values` representing the values to filter by. (optional)
   * @param sorts - An array of objects representing the sorting options for the admin entities. Each sort object contains a `key` representing the property to sort on and `value` representing the sort order ('ASC' or 'DESC'). (optional)
   *
   * @returns A Promise that resolves to a Pagination object containing the paginated list of admin entities and pagination metadata.
   */
  async findAllAdmins(
    searchQuery = '',
    withDeleted = false,
    options: IPaginationOptions = { page: 1, limit: 10 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ]
  ): Promise<Pagination<Admin, IPaginationMeta>> {
    let findOptions: FindManyOptions<Admin> = {};
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
        email: ILike(`%${searchQuery}%`),
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
    return paginate<Admin>(this, options, findOptions);
  }

  //Soft Delete an admin by id
  async softDeleteAdmin(id: string, updatedBy?: string): Promise<void> {
    return await this.manager.transaction(
      async (transactionalEntityManager) => {
        if (updatedBy) {
          await transactionalEntityManager.update(Admin, { id }, { updatedBy });
        }
        await transactionalEntityManager.softDelete(Admin, { id });
      }
    );
  }

  //Update Admin Status
  async updateAdminStatus(
    id: string,
    status: AdminStatus,
    updatedBy?: string
  ): Promise<UpdateResult> {
    if (updatedBy) {
      return await this.update(id, { status, updatedBy });
    }
    return await this.update(id, { status });
  }
}
