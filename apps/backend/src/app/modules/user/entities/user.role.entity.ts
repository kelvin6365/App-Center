import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { Role } from './../../role/entities/role.entity';
import { User } from './user.entity';
@Entity('user_role')
export class UserRole extends BaseEntity {
  @Column({ name: 'user_id', unique: false })
  userId: string;
  @Column({ name: 'role_id', unique: false })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.userRoles, { eager: true })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => User, (user: User) => user.roles)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;
}
