import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AuthProvider } from '../../../common/enum/auth.provider.enum';
import { BaseEntity } from '../../../database/entities/base.entity';
import { User } from './user.entity';
@Entity('user_provider')
export class UserProvider extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({
    default: 'email',
    name: 'provider',
    type: 'varchar',
  })
  provider: AuthProvider; // 'github', 'gitlab', etc.

  @Column({ nullable: true, name: 'provider_id' })
  providerId: string;

  @ManyToOne(() => User, (user: User) => user.providers)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
