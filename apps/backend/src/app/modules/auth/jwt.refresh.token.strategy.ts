import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import * as lodash from 'lodash';
import moment from 'moment';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { CurrentUserDTO } from './dto/current.user.dto';
import { LoginTokenType } from './enum/login.token.type.enum';
@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.header('x-refresh-token');
        },
      ]),
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate(payload: any): Promise<CurrentUserDTO> {
    if (payload.type != LoginTokenType.UserRefreshToken) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.getUserByUsernameWithDeletedFalse(
      payload.username
    );
    //TODO: Cache
    const userToken =
      await this.userService.getUserRefreshTokenWithDeletedFalse(user.id);
    const dbPayload = this.jwtService.decode(userToken.refreshToken);

    if (
      lodash.isEqual(payload, dbPayload) &&
      moment().isBefore(userToken.refreshTokenExpires)
    ) {
      return new CurrentUserDTO().fromEntity(user);
    }

    throw new UnauthorizedException();
  }
}
