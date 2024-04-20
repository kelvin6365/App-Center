import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create.tenant.dto';
import { UpdateTenantDto } from './dto/update.tenant.dto';
import { OptionsSlugify, slugify } from 'transliteration';
import { TenantRepository } from '../../database/repositories/tenant.repository';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class TenantService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tenantRepository: TenantRepository
  ) {}
  create(createTenantDto: CreateTenantDto) {
    return 'This action adds a new tenant';
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
