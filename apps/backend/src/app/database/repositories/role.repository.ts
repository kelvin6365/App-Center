// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { Role } from '../../modules/role/entities/role.entity';

// @Injectable()
// export class RoleRepository extends Repository<Role> {
//   constructor(dataSource: DataSource) {
//     super(Role, dataSource.createEntityManager());
//   }
//   async getRoleById(roleId: string, withDeleted = false): Promise<Role> {
//     try {
//       return await this.findOne({
//         where: { id: roleId },
//         withDeleted,
//       });
//     } catch (error) {
//       throw error;
//     }
//   }

//   async findAllWithDeleteFalse(): Promise<Role[]> {
//     try {
//       return await this.find({
//         withDeleted: false,
//       });
//     } catch (error) {
//       throw error;
//     }
//   }

//   async createRole(role: Role): Promise<any> {
//     try {
//       return await this.create(role);
//     } catch (error) {
//       throw error;
//     }
//   }
// }
