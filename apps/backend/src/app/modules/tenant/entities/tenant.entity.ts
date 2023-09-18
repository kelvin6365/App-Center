import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database/entities/base.entity';
import { UserTenant } from '../../user/entities/user.tenant.entity';
import { TenantStatus } from '../enum/tenant.status.enum';
@Entity('tenants')
export class Tenant extends BaseEntity {
  // tenant
  @Column()
  name: string;
  @Column({ name: 'domain_name', unique: true })
  domainName: string;

  @Column({ type: 'varchar', default: 'PENDING_ACTIVE' })
  status: TenantStatus;

  @OneToMany(() => UserTenant, (userTenant) => userTenant.tenant, {
    cascade: true,
  })
  users: UserTenant[];
}
