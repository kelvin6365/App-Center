import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { OptionsSlugify, slugify } from 'transliteration';
import { TenantRepository } from '../../database/repositories/tenant.repository';
import { UserRoleRepository } from '../../database/repositories/user.role.repository';
import { UserTenantRepository } from '../../database/repositories/user.tenent.repository';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { RoleId } from '../role/enum/role.id.enum';
import { RoleType } from '../role/enum/role.type.enum';
import { UserRole } from '../user/entities/user.role.entity';
import { UserTenant } from '../user/entities/user.tenant.entity';
import { CreateTenantDTO } from './dto/create.tenant.dto';
import { UpdateTenantDto } from './dto/update.tenant.dto';
import { Tenant } from './entities/tenant.entity';
import { TenantDTO } from './dto/tenant.dto';
@Injectable()
export class TenantService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenantRepository: TenantRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userTenantRepository: UserTenantRepository
  ) {}
  async createTenantAndJoinTenant(
    createTenantDto: CreateTenantDTO,
    user: CurrentUserDTO
  ) {
    const tenant = new Tenant();
    tenant.name = createTenantDto.name;
    tenant.domainName = await this.generateSlug(createTenantDto.name);
    tenant.createdBy = user.id;
    const createdTenant = await this.tenantRepository.createTenant(tenant);

    //create user tenant
    const userTenant = new UserTenant();
    userTenant.userId = user.id;
    userTenant.tenantId = createdTenant.id;
    await this.userTenantRepository.createUserTenant(userTenant);

    //create user role
    const userRole = new UserRole();
    userRole.roleId = RoleId[RoleType.ADMIN];
    userRole.tenantId = createdTenant.id;
    userRole.userId = user.id;

    await this.userRoleRepository.createUserRole(userRole);

    return new TenantDTO(createdTenant);
  }

  findAll() {
    return `This action returns all tenant`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tenant`;
  }

  update(id: number, updateTenantDto: UpdateTenantDto) {
    return `This action updates a #${id} tenant`;
  }

  remove(id: number) {
    return `This action removes a #${id} tenant`;
  }

  async generateSlug(domainName: string): Promise<string> {
    //1. gen slug
    let slug = slugify(
      domainName,
      this.configService.get<OptionsSlugify>('services.slugify')
    );
    let isExists: string | null;
    //2. check exists
    do {
      isExists = await this.tenantRepository.findByDomainNameReturnDomainName(
        slug
      );
      if (isExists != null) {
        //3.1 exists
        const genCode = nanoid(3);
        slug = slugify(
          `${domainName} ${genCode}`,
          this.configService.get<OptionsSlugify>('services.slugify')
        );
      }
    } while (isExists != null);
    //3.2 not exists, return slug
    return slug;
  }
}
