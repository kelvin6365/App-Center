// import { Injectable } from '@nestjs/common';
// import { DataSource, Repository } from 'typeorm';
// import { DateUtil } from '../../common/util/date.util';

// import * as moment from 'moment';
// import {
//   UserToken,
//   UserTokenType,
// } from '../../modules/users/entities/user.token.entity';

// @Injectable()
// export class UserTokenRepository extends Repository<UserToken> {
//   private readonly dateUtil: DateUtil;
//   constructor(dataSource: DataSource) {
//     super(UserToken, dataSource.createEntityManager());
//   }

//   async expiryActiveTokenByUserId(tokenType: UserTokenType, userId: string) {
//     try {
//       return await this.createQueryBuilder()
//         .update(UserToken)
//         .set({
//           expiryDate: new Date(),
//           updatedAt: new Date(),
//           updatedBy: userId,
//         })
//         .where({
//           userId: userId,
//           type: tokenType,
//         })
//         .andWhere('expiry_date > current_timestamp')
//         .softDelete()
//         .execute();
//     } catch (error) {
//       throw error;
//     }
//   }

//   async checkMatchUserEmailVerifyEmailToken(
//     userId: string,
//     token: string,
//     exp: Date,
//     type: UserTokenType,
//   ): Promise<UserToken> {
//     try {
//       return await this.findOne({
//         where: {
//           userId: userId,
//           token: token,
//           expiryDate: moment(exp).toDate(),
//           type: type,
//         },
//       });
//     } catch (error) {
//       throw error;
//     }
//   }
// }
