import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from './user.entity';

@Entity('user_refresh_token')
export class UserRefreshToken extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user: User) => user.refreshToken)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;
  @Column({ name: 'refresh_token_expires', nullable: true })
  refreshTokenExpires: Date;
}
