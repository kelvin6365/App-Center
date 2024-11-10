import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { CurrentUserDTO } from './dto/current.user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passReqToCallback: true,
    });
  }
  async validate(
    req: Request,
    username: string,
    password: string,
  ): Promise<CurrentUserDTO> {
    try {
      const user = await this.authService.validateUser(username, password);
      return user;
    } catch (error) {
      req.res.clearCookie('Authentication');
      throw error;
    }
  }
}
