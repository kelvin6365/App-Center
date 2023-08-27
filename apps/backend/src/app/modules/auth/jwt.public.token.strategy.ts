import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';
import { CurrentUserDTO } from './dto/current.user.dto';
@Injectable()
export class JwtPublicTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-public-token'
) {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
    private jwtService: JwtService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }
  async authenticate(req: any) {
    const payload =
      this.jwtService.decode(
        req.headers['authorization']?.split('Bearer ')[1]
      ) || null;
    if (payload) {
      return this.success(await this.validate(payload));
    }
    return this.success({});
  }

  async validate(payload: any): Promise<CurrentUserDTO> {
    const user = await this.userService.getUserByUsernameWithDeletedFalse(
      payload.username
    );
    if (user) {
      return new CurrentUserDTO().fromEntity(user);
    }
    return null;
  }
}
