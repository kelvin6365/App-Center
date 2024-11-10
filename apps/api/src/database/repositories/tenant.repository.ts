import { Tenant } from '@/modules/tenant/entities/tenant.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TenantRepository extends Repository<Tenant> {
  constructor(dataSource: DataSource) {
    super(Tenant, dataSource.createEntityManager());
  }

  createTenant(tenant: Tenant): Promise<Tenant> {
    return this.save(tenant);
  }

  //find by domain name
  async findByDomainNameReturnDomainName(domainName: string): Promise<string> {
    const tenant = await this.findOne({
      where: {
        domainName,
      },
    });
    return tenant?.domainName;
  }

  //find by id
  async findTenantById(id: string): Promise<Tenant> {
    return await this.findOne({
      where: {
        id,
      },
    });
  }
}
