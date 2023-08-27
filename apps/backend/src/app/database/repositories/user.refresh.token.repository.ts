import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserRefreshToken } from '../../modules/user/entities/user.refresh.token.entity';

@Injectable()
export class UserRefreshTokenRepository extends Repository<UserRefreshToken> {
  constructor(dataSource: DataSource) {
    super(UserRefreshToken, dataSource.createEntityManager());
  }

  createUserRefreshToken(
    userRefreshTokenEntity: UserRefreshToken
  ): Promise<UserRefreshToken> {
    return this.save(this.create(userRefreshTokenEntity));
  }
}
