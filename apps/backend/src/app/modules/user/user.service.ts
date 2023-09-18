import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { RoleId } from '../role/enum/role.id.enum';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user.profile.entity';
import { UserRefreshToken } from './entities/user.refresh.token.entity';
import { UserRole } from './entities/user.role.entity';
import { SignUpDTO } from '../auth/dto/signup.request.dto';
import { UserRepository } from '../../database/repositories/users.repository';
import { UserRefreshTokenRepository } from '../../database/repositories/user.refresh.token.repository';
import { UserPermission } from './entities/user.permission.entity';
import PermissionEnum from '../permission/enum/permission.enum';
import { CreateUserDTO } from './dto/create.user.dto';
import { hashPassword } from '../../common/util/password.util';
import { PortalUserResponseDTO } from './dto/portal.user.response.dto';
import { omit } from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly usersRepository: UserRepository,
    private readonly userRefreshTokenRepository: UserRefreshTokenRepository
  ) {}
  async signUp(signUpDTO: SignUpDTO): Promise<User> {
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
    //permissions
    const viewAllAppPermission = new UserPermission();
    viewAllAppPermission.permissionId = PermissionEnum.VIEW_ALL_APP;
    const editAllAppPermission = new UserPermission();
    editAllAppPermission.permissionId = PermissionEnum.EDIT_ALL_APP;
    const deleteAllAppVersionPermission = new UserPermission();
    deleteAllAppVersionPermission.permissionId =
      PermissionEnum.DELETE_ALL_APP_VERSION;
    const createAllAppVersionPermission = new UserPermission();
    createAllAppVersionPermission.permissionId =
      PermissionEnum.CREATE_ALL_APP_VERSION;
    newUser.permissions = [
      viewAllAppPermission,
      editAllAppPermission,
      deleteAllAppVersionPermission,
      createAllAppVersionPermission,
    ];
    const result = await this.usersRepository.createUser(newUser);
    return result;
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

  //Create user from user management
  async createUser(newUserDTO: CreateUserDTO) {
    const newUser = new User();
    const newProfile = new UserProfile();
    newUser.username = newUserDTO.username;
    newUser.password = await hashPassword(newUserDTO.password);
    newProfile.email = newUserDTO.email;
    newProfile.name = newUserDTO.name;
    newUser.profile = newProfile;
    newUser.refreshToken = new UserRefreshToken();
    //Assign roles
    newUser.roles = [];
    newUserDTO.roleTypes.forEach((roleType) => {
      const userRole = new UserRole();
      userRole.roleId = RoleId[roleType];
      newUser.roles.push(userRole);
    });
    //Assign permissions
    newUser.permissions = [];
    newUserDTO.permissions.forEach((permission) => {
      const userPermission = new UserPermission();
      userPermission.userId = newUser.id;
      userPermission.permissionId = permission;
      newUser.permissions.push(userPermission);
    });
    //Create user
    await this.usersRepository.createUser(newUser);
    return true;
  }

  //Get User By ID
  async getUserByIdWithDeletedFalse(
    userId: string
  ): Promise<PortalUserResponseDTO> {
    const user = omit(
      await this.usersRepository.findUserByUserIdWithDeletedFalse(userId),
      ['password', 'refreshToken']
    );
    return new PortalUserResponseDTO(user);
  }
}
