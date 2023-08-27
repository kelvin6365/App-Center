import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { RoleId } from '../role/enum/role.id.enum';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user.profile.entity';
import { UserRefreshToken } from './entities/user.refresh.token.entity';
import { UserRole } from './entities/user.role.entity';
import { SignUpDTO } from '../auth/dto/signup.request.dto';
import { UserRepository } from '../../database/repositories/users.repository';
import { UserRefreshTokenRepository } from '../../database/repositories/user.refresh.token.repository';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly usersRepository: UserRepository,
    private readonly userRefreshTokenRepository: UserRefreshTokenRepository
  ) {}
  async createUser(signUpDTO: SignUpDTO): Promise<User> {
    const newUser = new User();
    const newProfile = new UserProfile();
    newUser.username = signUpDTO.username;
    newUser.password = await signUpDTO.password;
    newProfile.email = signUpDTO.email;
    newProfile.name = signUpDTO.name;
    newUser.profile = newProfile;
    newUser.refreshToken = new UserRefreshToken();
    const userRole = new UserRole();
    userRole.roleId = RoleId.ADMIN;
    newUser.roles = [userRole];
    console.log(newUser);
    return await this.usersRepository.createUser(newUser);
  }

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenExpiresDate: Date
  ) {
    return this.userRefreshTokenRepository.update(
      { userId },
      {
        refreshToken,
        refreshTokenExpires: refreshTokenExpiresDate,
      }
    );
  }

  async getUserByUsernameWithDeletedFalse(username: string): Promise<User> {
    try {
      const result =
        await this.usersRepository.findUserByUserNameWithDeletedFalse(username);
      return result;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async getUserRefreshTokenWithDeletedFalse(
    userId: string
  ): Promise<UserRefreshToken> {
    try {
      //TODO: Enhance
      const result =
        await this.usersRepository.findUserByUserIdWithDeletedFalse(userId);
      return result.refreshToken;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
