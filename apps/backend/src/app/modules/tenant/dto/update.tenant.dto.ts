import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDTO } from './create.tenant.dto';

export class UpdateTenantDto extends PartialType(CreateTenantDTO) {}
