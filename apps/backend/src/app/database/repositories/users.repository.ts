import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../../modules/user/entities/user.entity';

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

  addRoleToUser(user: User): Promise<User> {
    return this.save(user);
  }

  findUserByUserNameWithDeletedFalse(username: string): Promise<User> {
    return this.findOne({
      where: { username },
      relations: ['profile', 'roles', 'permissions'],
      withDeleted: false,
    });
  }

  findUserByUserIdWithDeletedFalse(userId: string): Promise<User> {
    return this.findOne({
      where: { id: userId },
      relations: ['profile', 'roles', 'permissions'],
      withDeleted: false,
    });
  }

  // findPublicProfileByIdWithDeletedFalse(id: string): Promise<User> {
  //   return this.findOne({
  //     select: {
  //       id: true,
  //       profile: {
  //         name: true,
  //       },
  //     },
  //     where: { id: id },
  //     relations: ['profile'],
  //     withDeleted: false,
  //   });
  // }
}
