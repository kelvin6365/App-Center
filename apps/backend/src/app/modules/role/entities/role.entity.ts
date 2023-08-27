import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserRole } from '../../user/entities/user.role.entity';
import { RoleType } from '../enum/role.type.enum';

@Entity('role')
export class Role extends BaseEntity {
  @Column({ type: 'varchar' })
  type: RoleType;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
