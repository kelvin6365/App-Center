import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { PostgresErrorCode } from '../../common/enum/postgres.error.code.enum';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { UserService } from '../user/user.service';
import { SignUpDTO } from './dto/signup.request.dto';
import { isMatchPassword } from '../../common/util/password.util';
import { CurrentUserDTO } from './dto/current.user.dto';
import { ConfigService } from '@nestjs/config';
import { LoginResponseDTO } from './dto/login.response.dto';
import { LoginTokenType } from './enum/login.token.type.enum';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService
  ) {}
  async signUp(signUpDTO: SignUpDTO): Promise<boolean> {
    try {
      await this.userService.signUp(signUpDTO);
      return true;
    } catch (error) {
      this.logger.error(error);
      switch (error.code) {
        case PostgresErrorCode.UniqueViolation:
          throw new AppException(ResponseCode.STATUS_8013_USER_ALREADY_EXIST);
        default:
          throw error;
      }
    }
  }

  async signIn(user: CurrentUserDTO): Promise<LoginResponseDTO> {
    const payloadAccess = {
      username: user.username,
      sub: user.id,
      type: LoginTokenType.UserAccessToken,
    };
    const payloadRefresh = {
      username: user.username,
      sub: user.id,
      type: LoginTokenType.UserRefreshToken,
    };
    const refreshTokenExpiresDate = moment()
      .add(
        this.configService.get<number>('jwt.user.refreshTokenExpiresIn'),
        'days'
      )
      .toDate();
    const refreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: `${this.configService.get<number>(
        'jwt.user.refreshTokenExpiresIn'
      )} days`,
    });
    await this.userService.updateUserRefreshToken(
      user.id,
      refreshToken,
      refreshTokenExpiresDate
    );
    const accessTokenExpires = moment()
      .add(
        this.configService.get<number>('jwt.user.accessTokenExpiresIn'),
        'days'
      )
      .toDate();
    const accessToken = this.jwtService.sign(payloadAccess);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      accessTokenExpires: accessTokenExpires,
    };
  }

  async validateUser(
    username: string,
    hashedPassword: string
  ): Promise<CurrentUserDTO> {
    const user = await this.userService.getUserByUsernameWithDeletedFalse(
      username
    );
    if (!user) {
      throw new AppException(
        ResponseCode.STATUS_8001_USER_USERNAME_OR_PASSWORD_NOT_MATCH
      );
    }
    if (!(await isMatchPassword(hashedPassword, user.password))) {
      throw new AppException(
        ResponseCode.STATUS_8001_USER_USERNAME_OR_PASSWORD_NOT_MATCH
      );
    }
    user.password = undefined;
    return new CurrentUserDTO().fromEntity(user);
  }
}
