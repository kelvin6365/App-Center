import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AdminService } from '../../admin/admin.service';
import { CurrentAdminDTO } from './dto/current.admin.dto';

@Injectable()
export class JwtAdminStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
  constructor(
    readonly configService: ConfigService,
    private readonly adminService: AdminService
  ) {
    super({
      jwtFromRequest:
        // ExtractJwt.fromExtractors([
        //   (request: Request) => {
        //     return request?.cookies?.Authentication;
        //   },
        // ]),

        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
      passReqToCallback: true,
    });
  }

  async validate(
    request: Request,
    payload: {
      username: string;
      sub: string;
      type: string;
      iat: number;
      exp: number;
    }
  ): Promise<CurrentAdminDTO> {
    // {
    //   username: 'admin@admin.com',
    //   sub: 'd8165850-228d-4c5f-a99d-ad9e438c1baa',
    //   type: 'ACCESS_TOKEN',
    //   iat: 1694792896,
    //   exp: 1697384896
    // }

    //Validate payload jwt type
    if (payload.type !== 'ADMIN_ACCESS_TOKEN') {
      throw new UnauthorizedException('Invalid token type');
    }

    const user: CurrentAdminDTO = await this.adminService.validateUser(
      request,
      payload.username
    );
    return user;
  }
}
