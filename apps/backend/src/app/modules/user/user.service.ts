import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { PageDTO } from '../../common/dto/page.dto';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { hashPassword, isMatchPassword } from '../../common/util/password.util';
import { UserRefreshTokenRepository } from '../../database/repositories/user.refresh.token.repository';
import { UserRepository } from '../../database/repositories/users.repository';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { SignUpDTO } from '../auth/dto/signup.request.dto';
import { RoleId } from '../role/enum/role.id.enum';
import { CreateUserDTO } from './dto/create.user.dto';
import { PortalUserResponseDTO } from './dto/portal.user.response.dto';
import { UpdateUserDTO } from './dto/update.user.dto';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user.profile.entity';
import { UserRefreshToken } from './entities/user.refresh.token.entity';
import { UserRole } from './entities/user.role.entity';
import { UserTenant } from './entities/user.tenant.entity';
import { UserStatus } from './enum/user.status.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly usersRepository: UserRepository,
    private readonly userRefreshTokenRepository: UserRefreshTokenRepository
  ) {}
  async signUp(signUpDTO: SignUpDTO): Promise<User> {
    //! New User need to walk through onboarding to create a tenant.
    const newUser = new User();
    const newProfile = new UserProfile();
    newUser.username = signUpDTO.username;
    newUser.password = await signUpDTO.password;
    newProfile.email = signUpDTO.email;
    newUser.status = UserStatus.Pending;
    newProfile.name = signUpDTO.name;
    newUser.profile = newProfile;
    newUser.refreshToken = new UserRefreshToken();

    // const userRole = new UserRole();
    // userRole.roleId = RoleId.ADMIN;
    // newUser.roles = [userRole];
    // !permissions [Signup will not handle permissions]
    // const viewAllAppPermission = new UserPermission();
    // viewAllAppPermission.permissionId = PermissionEnum.VIEW_ALL_APP;
    // const editAllAppPermission = new UserPermission();
    // editAllAppPermission.permissionId = PermissionEnum.EDIT_ALL_APP;
    // const deleteAllAppVersionPermission = new UserPermission();
    // deleteAllAppVersionPermission.permissionId =
    //   PermissionEnum.DELETE_ALL_APP_VERSION;
    // const createAllAppVersionPermission = new UserPermission();
    // createAllAppVersionPermission.permissionId =
    //   PermissionEnum.CREATE_ALL_APP_VERSION;
    // newUser.permissions = [
    //   viewAllAppPermission,
    //   editAllAppPermission,
    //   deleteAllAppVersionPermission,
    //   createAllAppVersionPermission,
    // ];
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
    newUser.status = newUserDTO.status;
    //tenants
    newUser.tenants = [];
    newUserDTO.tenantIds.forEach((tenantId) => {
      const userTenant = new UserTenant();
      userTenant.tenantId = tenantId;
      userTenant.userId = newUser.id;
      newUser.tenants.push(userTenant);
    });

    //Assign roles
    newUser.roles = [];
    newUserDTO.roleTypes.forEach((roleType) => {
      newUser.tenants.forEach((userTenant) => {
        const userRole = new UserRole();
        userRole.roleId = RoleId[roleType];
        userRole.tenantId = userTenant.tenantId;
        newUser.roles.push(userRole);
      });
    });
    //!Assign permissions [Create new user will not handle permissions]
    // newUser.permissions = [];
    // newUserDTO.permissions.forEach((permission) => {
    //   const userPermission = new UserPermission();
    //   userPermission.userId = newUser.id;
    //   userPermission.permissionId = permission;
    //   newUser.permissions.push(userPermission);
    // });

    //Create user
    await this.usersRepository.createUser(newUser);
    return true;
  }

  //Get User By ID
  async getUserByIdWithDeletedFalse(
    userId: string
  ): Promise<PortalUserResponseDTO> {
    console.log(
      await this.usersRepository.findUserByUserIdWithDeletedFalse(userId)
    );
    const user = await this.usersRepository.findUserByUserIdWithDeletedFalse(
      userId
    );
    return new PortalUserResponseDTO(user);
  }

  async findUserByEmailWithPassword(username: string) {
    return await this.usersRepository.findUserByEmailWithPassword(username);
  }

  //Search User
  async searchUser(
    tenantId: string,
    searchQuery = '',
    withDeleted = false,
    page = 1,
    limit = 10,
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ],
    user: CurrentUserDTO
  ): Promise<Promise<PageDTO<PortalUserResponseDTO>>> {
    const users = await this.usersRepository.searchUsers(
      [tenantId],
      searchQuery,
      withDeleted,
      {
        page,
        limit,
      },
      filters,
      sorts
    );
    return {
      ...users,
      items: users.items.map((user) => new PortalUserResponseDTO(user)),
    };
  }

  async updateUserStatus(id: string, status: UserStatus) {
    await this.usersRepository.updateUserStatus(id, status);
    return true;
  }

  //update user profile
  async updateUserProfile(updateProfile: UpdateUserDTO, user: CurrentUserDTO) {
    //check if user exists
    const currentUser = await this.usersRepository.findUserByEmailWithPassword(
      user.username
    );
    if (!currentUser) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    if (updateProfile.password) {
      if (
        !(await isMatchPassword(
          updateProfile.oldPassword,
          currentUser.password
        ))
      ) {
        throw new AppException(
          ResponseCode.STATUS_8005_USER_PASSWORD_NOT_MATCH
        );
      }
      currentUser.password = await hashPassword(updateProfile.password);
    }
    if (updateProfile.name) {
      currentUser.profile.name = updateProfile.name;
    }
    const updatedUser =
      await this.usersRepository.updateUserProfileNameOrPassword(
        user.id,
        currentUser
      );
    return new PortalUserResponseDTO(updatedUser);
  }
}
