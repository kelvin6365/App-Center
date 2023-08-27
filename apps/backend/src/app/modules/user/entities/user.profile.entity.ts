import { File } from '../../file/entities/file.entity';
import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from '../../../database/entities/base.entity';

@Entity('user_profile')
export class UserProfile extends BaseEntity {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: 'jsonb', array: false, nullable: true })
  extra: Record<string, unknown>;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'avatar_id', nullable: true, type: 'uuid' })
  avatarId: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToOne(() => File, { eager: true })
  @JoinColumn({
    name: 'avatar_id',
    referencedColumnName: 'id',
  })
  avatar: File;
}
