import { BaseEntity } from '../../../database/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { AdminStatus } from '../enum/admin.status.enum';
@Entity('admins')
export class Admin extends BaseEntity {
  //Admin user
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'varchar', default: 'PENDING_ACTIVE' })
  status: AdminStatus;
}
