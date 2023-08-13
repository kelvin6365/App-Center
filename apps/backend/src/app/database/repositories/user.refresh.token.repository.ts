// import { Injectable } from '@nestjs/common';
// import { UserRefreshToken } from '../../modules/users/entities/user.refresh.token.entity';
// import { DataSource, Repository } from 'typeorm';

// @Injectable()
// export class UserRefreshTokenRepository extends Repository<UserRefreshToken> {
//   constructor(dataSource: DataSource) {
//     super(UserRefreshToken, dataSource.createEntityManager());
//   }

//   async createUserRefreshToken(
//     userRefreshTokenEntity: UserRefreshToken,
//   ): Promise<UserRefreshToken> {
//     try {
//       return await this.save(this.create(userRefreshTokenEntity));
//     } catch (error) {
//       throw error;
//     }
//   }
// }
