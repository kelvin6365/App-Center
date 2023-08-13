// import { DataSource, Repository } from 'typeorm';
// import { Injectable } from '@nestjs/common';
// import { User } from '../../modules/users/entities/user.entity';
// import { isUUID } from 'class-validator';

// @Injectable()
// export class UserRepository extends Repository<User> {
//   constructor(dataSource: DataSource) {
//     super(User, dataSource.createEntityManager());
//   }

//   async createUser(userEntity: User): Promise<User> {
//     try {
//       return await this.save(this.create(userEntity));
//     } catch (error) {
//       throw error;
//     }
//   }

//   async updateUser(userEntity: User): Promise<User> {
//     try {
//       return await this.save(userEntity);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async addRoleToUser(user: User): Promise<User> {
//     try {
//       return await this.save(user);
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findUserByUserNameWithDeletedFalse(username: string): Promise<User> {
//     try {
//       return await this.findOne({
//         where: { username },
//         relations: ['profile', 'refreshToken', 'roles.role.translations'],
//         withDeleted: false,
//       });
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findUserByUserIdWithDeletedFalse(userId: string): Promise<User> {
//     try {
//       return await this.findOne({
//         where: { id: userId },
//         relations: ['profile', 'refreshToken', 'roles.role.translations'],
//         withDeleted: false,
//       });
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findPublicProfileByIdOrSlugWithDeletedFalse(
//     idOrSlug: string,
//   ): Promise<User> {
//     try {
//       if (isUUID(idOrSlug)) {
//         return await this.findOne({
//           select: {
//             id: true,
//             profile: {
//               name: true,
//               description: true,
//               slug: true,
//             },
//           },
//           where: { id: idOrSlug },
//           relations: ['profile'],
//           withDeleted: false,
//         });
//       } else {
//         return await this.findOne({
//           select: {
//             id: true,
//             profile: {
//               name: true,
//               description: true,
//               slug: true,
//             },
//           },
//           where: { profile: { slug: idOrSlug } },
//           relations: ['profile'],
//           withDeleted: false,
//         });
//       }
//     } catch (error) {
//       throw error;
//     }
//   }
// }
