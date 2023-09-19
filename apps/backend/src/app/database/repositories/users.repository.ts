import { Injectable } from '@nestjs/common';
import {
  DataSource,
  FindManyOptions,
  ILike,
  In,
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

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  createUser(userEntity: User): Promise<User> {
    return this.save(this.create(userEntity));
  }

  updateUser(userEntity: User): Promise<User> {
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
      },
      {
        username: ILike(`%${searchQuery}%`),
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
}
