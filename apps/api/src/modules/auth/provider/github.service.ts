// src/auth/github-auth.service.ts
import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { AppException } from '../../../common/response/app.exception';
import { ResponseCode } from '../../../common/response/response.code';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';
import { CurrentUserDTO } from '../dto/current.user.dto';
import { GithubSignupDto } from '../dto/github.signup.dto';
import { GithubUserDto } from '../dto/github.user.dto';

@Injectable()
export class GithubAuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    // private configService: ConfigService,
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async handleGithubAuth(code: string) {
    try {
      const githubUser = await this.getGithubUser(code);
      let user = await this.userService.findUserByEmailWithPassword(
        githubUser.email,
      );
      if (!user) {
        await this.userService.signUpGithub(
          new GithubSignupDto({
            email: githubUser.email,
            name: githubUser.name,
            username: githubUser.email,
            providerId: githubUser.id.toString(),
          }),
        );
      }

      user = await this.userService.getUserByUsernameWithDeletedFalse(
        githubUser.email,
      );
      return await this.authService.signIn(
        new CurrentUserDTO().fromEntity(user),
      );
    } catch (error) {
      console.error(error);
      this.logger.error(error);
      throw new AppException(ResponseCode.STATUS_8000_UNAUTHORIZED);
    }
  }

  private async getGithubUser(token: string) {
    const { data } = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return new GithubUserDto(data);
  }
}
