import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { CurrentUserDTO } from './dto/current.user.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService
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

  async validate(request: Request, payload: any): Promise<any> {
    const user = await this.userService.findUserByEmailWithPassword(
      payload.username
    );
    if (!user) {
      request.res.clearCookie('Authentication');
      throw new UnauthorizedException();
    }
    return new CurrentUserDTO().fromEntity(user);
  }
}
