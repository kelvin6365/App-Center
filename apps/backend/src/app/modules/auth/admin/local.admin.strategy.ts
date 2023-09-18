import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AdminService } from '../../admin/admin.service';
import { CurrentAdminDTO } from './dto/current.admin.dto';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin'
) {
  constructor(private readonly adminService: AdminService) {
    super({
      usernameField: 'username',
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    username: string,
    password: string
  ): Promise<CurrentAdminDTO> {
    try {
      const user: CurrentAdminDTO = await this.adminService.validateUser(
        req,
        username,
        password
      );
      return user;
    } catch (error) {
      req.res.clearCookie('Authentication');
      throw error;
    }
  }
}
