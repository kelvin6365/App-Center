import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  ILike,
  In,
  IsNull,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';
import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { UserStatus } from '../../modules/user/enum/user.status.enum';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import AppsPermission from '../../modules/permission/enum/apps.permission.enum';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    dataSource: DataSource,
    @Inject(Logger) private readonly logger: LoggerService
  ) {
    super(User, dataSource.createEntityManager());
  }

  //find user by email for match password
  async findUserByEmailWithPassword(
    username: string,
    withDeleted = false
  ): Promise<User> {
    return await this.findOne({
      select: [
        'id',
        'username',
        'refId',
        'status',
        'password',
        'createdAt',
        'deletedAt',
        'updatedAt',
        'tenants',
        'roles',
        'permissions',
        'profile',
      ],
      where: { username },
      withDeleted,
      relations: ['tenants', 'roles', 'permissions', 'profile'],
    });
  }

  async createUser(userEntity: User): Promise<User> {
    try {
      return await this.save(this.create(userEntity));
    } catch (error) {
      this.logger.error(error);
      switch (error.code) {
        case '23505':
          throw new AppException(
            ResponseCode.STATUS_1012_FAIL_TO_CREATE('User already exist.')
          );
        default:
          throw error;
      }
    }
  }

  updateUser(userEntity: User, updatedBy?: string): Promise<User> {
    if (updatedBy) {
      userEntity.updatedBy = updatedBy;
    }
    return this.save(userEntity);
  }

  updateUserStatus(id: string, status: UserStatus): Promise<UpdateResult> {
    return this.update(id, { status });
  }

  addRoleToUser(user: User): Promise<User> {
    return this.save(user);
  }

  findUserByUserNameWithDeletedFalse(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      relations: ['profile', 'roles', 'permissions', 'tenants'],
      withDeleted: false,
    });
  }

  findUserByUserIdWithDeletedFalse(userId: string): Promise<User> {
    return this.findOne({
      where: { id: userId },
      relations: ['profile', 'roles', 'permissions', 'tenants'],
      withDeleted: false,
    });
  }

  async searchUsers(
    tenantIds: string[],
    searchQuery = '',
    withDeleted = false,
    options: IPaginationOptions = { page: 1, limit: 10 },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ]
  ): Promise<Pagination<User, IPaginationMeta>> {
    let findOptions: FindManyOptions<User> = {};
    findOptions = {
      where: [],
      withDeleted,
      order: {},
      relations: [
        'profile',
        'roles',
        'permissions',
        'tenants',
        'tenants.tenant',
      ],
    };
    const orWhereOptions = [
      {
        profile: {
          name: ILike(`%${searchQuery}%`),
        },
        tenants: {
          tenantId: tenantIds
            ? In(tenantIds)
            : In(['00000000-0000-0000-0000-000000000000']),
        },
      },
      {
        username: ILike(`%${searchQuery}%`),
        tenants: {
          tenantId: tenantIds
            ? In(tenantIds)
            : In(['00000000-0000-0000-0000-000000000000']),
        },
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

    return paginate<User>(this, options, findOptions);
  }

  async updateUserProfileNameOrPassword(
    id: string,
    user: User,
    updatedBy?: string
  ): Promise<User> {
    if (updatedBy) {
      user.updatedBy = updatedBy;
      await this.save(user);
    } else {
      await this.save(user);
    }
    return await this.findOne({
      where: { id: id },
      relations: ['profile', 'roles', 'permissions', 'tenants'],
      withDeleted: false,
    });
  }

  async findAppPermissionsByRefIdGroupByUserId(refId: string) {
    return await this.find({
      where: {
        permissions: {
          refId,
          permissionId: In([
            AppsPermission.CREATE_APP_VERSION,
            AppsPermission.DELETE_APP_VERSION,
            AppsPermission.VIEW_APP,
            AppsPermission.EDIT_APP,
          ]),
          deletedAt: IsNull(),
        },
      },
      relations: ['permissions', 'profile'],
      withDeleted: false,
    });
  }
}
