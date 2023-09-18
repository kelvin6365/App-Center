import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { CreateAdminDto } from './dto/create.admin.dto';
import { UpdateAdminDto } from './dto/update.admin.dto';
import { AdminRepository } from '../../database/repositories/admin.repository';
import { AppException } from '../../common/response/app.exception';
import { hashPassword, isMatchPassword } from '../../common/util/password.util';
import { ResponseCode } from '../../common/response/response.code';
import { Request } from 'express';
import { CurrentAdminDTO } from '../auth/admin/dto/current.admin.dto';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDTO } from '../auth/admin/dto/login.response.dto';
import { Admin } from './entities/admin.entity';
import { AdminStatus } from './enum/admin.status.enum';
import { AdminResponseDTO } from './dto/admin.response.dto';
import { PageDto } from '../../common/dto/page.dto';
import { LoginTokenType } from '../auth/enum/login.token.type.enum';

@Injectable()
export class AdminService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {
    this.logger = new Logger('AdminService');
  }
  //For Login
  async validateUser(
    req: Request,
    username: string,
    hashedPassword?: string
  ): Promise<CurrentAdminDTO> {
    const admin = await this.adminRepository.findAdminByEmailWithPassword(
      username
    );
    if (!admin) {
      req.res.clearCookie('Authentication');
      throw new AppException(
        ResponseCode.STATUS_8001_USER_USERNAME_OR_PASSWORD_NOT_MATCH
      );
    }
    if (hashedPassword) {
      if (!(await isMatchPassword(hashedPassword, admin.password))) {
        req.res.clearCookie('Authentication');
        throw new AppException(
          ResponseCode.STATUS_8001_USER_USERNAME_OR_PASSWORD_NOT_MATCH
        );
      }
    }
    if (admin.status === AdminStatus.PendingActive) {
      req.res.clearCookie('Authentication');
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }
    admin.password = undefined;
    return new CurrentAdminDTO(admin);
  }

  async signTokenForLogin(admin: CurrentAdminDTO) {
    const payloadAccess = {
      username: admin.email,
      sub: admin.id,
      type: LoginTokenType.AdminAccessToken,
    };
    const accessTokenExpires = moment()
      .add(
        this.configService.get<number>('jwt.user.accessTokenExpiresIn'),
        'days'
      )
      .toDate();
    const accessToken = this.jwtService.sign(payloadAccess);
    return new LoginResponseDTO(accessToken, accessTokenExpires);
  }

  async create(createAdminDto: CreateAdminDto, user: CurrentAdminDTO) {
    const admin = new Admin();
    admin.email = createAdminDto.email;
    admin.name = createAdminDto.name;
    admin.password = await hashPassword(createAdminDto.password);
    admin.status = AdminStatus.PendingActive;
    admin.createdBy = user.id;
    await this.adminRepository.createAdmin(admin);

    return true;
  }

  async findAll(
    searchQuery = '',
    withDeleted = false,
    page = 1,
    limit = 10,
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ],
    user: CurrentAdminDTO
  ): Promise<PageDto<AdminResponseDTO>> {
    const result = await this.adminRepository.findAllAdmins(
      searchQuery,
      withDeleted,
      {
        page,
        limit,
      },
      filters,
      sorts
    );
    return {
      ...result,
      items: result.items.map((admin) => new AdminResponseDTO(admin)),
    };
  }

  async findOne(id: string): Promise<AdminResponseDTO> {
    const admin = await this.adminRepository.findAdminById(id);
    if (!admin) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    return new AdminResponseDTO(admin);
  }

  async updateStatus(
    id: string,
    updateAdminDto: UpdateAdminDto,
    user: CurrentAdminDTO
  ): Promise<boolean> {
    const admin = await this.adminRepository.findAdminById(id);
    if (!admin) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    //Update Admin Status
    if (updateAdminDto.status) {
      this.logger.log(
        `Update Admin Status ${admin.status} -> ${updateAdminDto.status}`
      );
      await this.adminRepository.updateAdminStatus(
        id,
        updateAdminDto.status,
        user.id
      );
    }
    return true;
  }

  async softDelete(id: string, user: CurrentAdminDTO) {
    await this.adminRepository.softDeleteAdmin(id, user.id);
    this.logger.log(`Soft Deleted Admin : ${id}`);
    return true;
  }
}
