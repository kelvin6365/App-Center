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
import { AddUserRequestDTO } from './dto/add.user.request.dto';
import { UserPermission } from './entities/user.permission.entity';
import { UserPermissionRepository } from '../../database/repositories/user.permission.repository';
import AppsPermission from '../permission/enum/apps.permission.enum';
import { OnBoardingDTO } from '@/modules/user/dto/onboarding.dto';
import { TenantRepository } from '@/database/repositories/tenant.repository';
import { Tenant } from '@/modules/tenant/entities/tenant.entity';
import { UserTenantRepository } from '@/database/repositories/user.tenent.repository';
import { TenantUtil } from '@/modules/tenant/tenant.util';
import { TenantService } from '../tenant/tenant.service';
import { RoleType } from '../role/enum/role.type.enum';
import { UserRoleRepository } from '../../database/repositories/user.role.repository';
import { InviteUserToTenantDTO } from './dto/invite.user.to.tenant.dto';
import { SubscriptionRepository } from '../../database/repositories/subscription.repository';
import { GithubSignupDto } from '../auth/dto/github.signup.dto';
import { AuthProvider } from '../../common/enum/auth.provider.enum';

@Injectable()
export class UserService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly usersRepository: UserRepository,
    private readonly userRefreshTokenRepository: UserRefreshTokenRepository,
    private readonly userPermissionRepository: UserPermissionRepository,
    private readonly tenantRepository: TenantRepository,
    private readonly userTenantRepository: UserTenantRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly tenantUtil: TenantUtil,
    private readonly tenantService: TenantService,
    private readonly subscriptionRepository: SubscriptionRepository
  ) {}
  async signUp(signUpDTO: SignUpDTO): Promise<User> {
    //! New User need to walk through onboarding to create a tenant.
    const newUser = new User();
    const newProfile = new UserProfile();
    newUser.username = signUpDTO.username;
    newUser.password = await signUpDTO.password;
    newProfile.email = signUpDTO.email ?? signUpDTO.username;
    newUser.status = UserStatus.Pending;
    newProfile.name = signUpDTO.name;
    newUser.profile = newProfile;
    newUser.refreshToken = new UserRefreshToken();
    const result = await this.usersRepository.createUser(newUser);
    return result;
  }

  async signUpGithub(signUpDTO: GithubSignupDto): Promise<User> {
    //! New User need to walk through onboarding to create a tenant.
    const newUser = new User();
    const newProfile = new UserProfile();
    newUser.username = signUpDTO.username;
    newUser.provider = AuthProvider.GITHUB;
    newUser.providerId = signUpDTO.providerId;
    newProfile.email = signUpDTO.email ?? signUpDTO.username;
    newUser.status = UserStatus.Pending;
    newProfile.name = signUpDTO.name;
    newUser.profile = newProfile;
    newUser.refreshToken = new UserRefreshToken();
    const result = await this.usersRepository.createUser(newUser);
    return result;
  }

  async findUserByEmailAndProvider(
    email: string,
    provider: AuthProvider
  ): Promise<User> {
    const result = await this.usersRepository.findOne({
      where: {
        username: email,
        provider,
      },
      relations: ['profile'],
    });
    return result;
  }

  async updateUserRefreshToken(
    userId: string,
    refreshToken: string,
    refreshTokenExpiresDate: Date
  ) {
    return this.userRefreshTokenRepository.upsert(
      {
        userId,
        refreshToken,
        refreshTokenExpires: refreshTokenExpiresDate,
      },
      ['userId']
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
    const user = await this.usersRepository.findUserByUserIdWithDeletedFalse(
      userId
    );
    if (!user) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    //get subscriptions
    const subscriptions =
      await this.subscriptionRepository.findUserSubscriptionsByUserId(
        user.id,
        'active'
      );
    user.subscriptions = subscriptions;
    return new PortalUserResponseDTO(user);
  }

  async findUserByEmailWithPassword(
    username: string,
    providers: AuthProvider[]
  ) {
    return await this.usersRepository.findUserByEmailWithPassword(
      username,
      false,
      providers
    );
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

  //update user profile by Id
  async updateUserProfileById(
    updateProfile: UpdateUserDTO,
    id: string,
    tenantId: string
  ) {
    //check if user exists
    const currentUser =
      await this.usersRepository.findUserByUserIdWithDeletedFalse(id);
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
    //Role
    if (updateProfile.role && tenantId) {
      //get current user role
      const userRole =
        await this.userRoleRepository.findUserRoleByUserIdAndTenantId(
          id,
          tenantId
        );
      if (!userRole) {
        throw new AppException(ResponseCode.STATUS_8016_USER_ROLE_NOT_EXIST);
      }
      //update role
      userRole.roleId = RoleId[updateProfile.role];
      delete userRole.role;
      await this.userRoleRepository.updateUserRole(userRole);
      delete currentUser.roles;
    }
    const updatedUser =
      await this.usersRepository.updateUserProfileNameOrPassword(
        id,
        currentUser
      );
    return new PortalUserResponseDTO(updatedUser);
  }

  async addPermissions(
    userId: string,
    dto: AddUserRequestDTO,
    user: CurrentUserDTO
  ) {
    const targetUser =
      await this.usersRepository.findUserByUserIdWithDeletedFalse(userId);
    if (!targetUser) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }

    //clean user permissions based
    await this.userPermissionRepository.softDeleteByUserIdAndAppId(
      targetUser.id,
      dto.appId,
      [
        AppsPermission.VIEW_APP,
        AppsPermission.CREATE_APP_VERSION,
        AppsPermission.EDIT_APP,
        AppsPermission.DELETE_APP_VERSION,
      ],
      user.id
    );
    const permissions = dto.permissions.map((permission) => {
      const userPermission = new UserPermission();
      userPermission.userId = targetUser.id;
      userPermission.permissionId = permission;
      userPermission.refId = dto.appId;
      userPermission.createdBy = user.id;
      return userPermission;
    });
    await this.userPermissionRepository.addPermissions(permissions);
    return true;
  }

  async findUseAppPermissionsListByAppId(appId: string) {
    const users =
      await this.usersRepository.findAppPermissionsByRefIdGroupByUserId(appId);
    return users.map((user) => new PortalUserResponseDTO(user));
  }

  async onBoarding(onBoardingDTO: OnBoardingDTO, user: CurrentUserDTO) {
    //check user already onboarded
    const currentUser = await this.usersRepository.findUserByEmailWithPassword(
      user.username
    );
    if (!currentUser) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    if (currentUser.status !== UserStatus.Pending) {
      throw new AppException(
        ResponseCode.STATUS_8015_USER_NOT_AVAILABLE_TO_ONBOARDING
      );
    }

    //update user status
    currentUser.status = UserStatus.Activated;
    currentUser.profile.name = onBoardingDTO.name;

    await this.usersRepository.updateUserProfileNameOrPassword(
      user.id,
      currentUser,
      user.id
    );

    //create tenant
    const tenant = new Tenant();
    tenant.name = onBoardingDTO.tenantName;
    tenant.createdBy = user.id;
    tenant.domainName = await this.tenantService.generateSlug(
      onBoardingDTO.tenantName
    );
    await this.tenantRepository.createTenant(tenant);

    //create user tenant
    const userTenant = new UserTenant();
    userTenant.userId = user.id;
    userTenant.tenantId = tenant.id;
    userTenant.createdBy = currentUser.id;
    await this.userTenantRepository.createUserTenant(userTenant);

    //create user role
    const userRole = new UserRole();
    userRole.roleId = RoleId[RoleType.ADMIN];
    userRole.tenantId = tenant.id;
    userRole.userId = user.id;
    userRole.createdBy = currentUser.id;

    await this.userRoleRepository.createUserRole(userRole);

    return true;
  }

  //Delete user from tenant
  async deleteUserFromTenant(
    userId: string,
    tenantId: string,
    user: CurrentUserDTO
  ) {
    //check if user exists
    const targetUser =
      await this.usersRepository.findUserByUserIdWithDeletedFalse(userId);
    if (!targetUser) {
      throw new AppException(ResponseCode.STATUS_8004_USER_NOT_EXIST);
    }
    //check if user is admin
    const userRole =
      await this.userRoleRepository.findUserRoleByUserIdAndTenantId(
        targetUser.id,
        tenantId
      );
    if (!userRole) {
      throw new AppException(ResponseCode.STATUS_8016_USER_ROLE_NOT_EXIST);
    }

    //check this user is it the last admin with tenantId userId and role
    const admins =
      await this.userRoleRepository.findUserRoleByTenantIdAndRoleIdNotIncludeUserId(
        targetUser.id,
        tenantId,
        RoleId[RoleType.ADMIN]
      );
    if (admins.length === 0) {
      throw new AppException(ResponseCode.STATUS_8017_ADMIN_LESS_THAN_ONE);
    }

    //delete user role
    await this.userRoleRepository.removeUserRoleByUserIdAndTenantId(
      targetUser.id,
      tenantId,
      user.id
    );
    //remove user tenant
    await this.userTenantRepository.removeUserTenantByUserIdAndTenantId(
      targetUser.id,
      tenantId,
      user.id
    );

    return true;
  }

  async inviteUserToTenant(
    inviteUserToTenantDTO: InviteUserToTenantDTO,
    user: CurrentUserDTO,
    tenantId: string
  ) {
    //check if user exists
    const targetUser =
      await this.usersRepository.findUserByUserNameWithDeletedFalse(
        inviteUserToTenantDTO.email
      );

    //if user did not exist, send invite email with create account link
    //if user exist, send invite email
    if (targetUser) {
      //check if user already have role with tenantId
      const checkExits =
        await this.userRoleRepository.findUserRoleByUserIdAndTenantId(
          targetUser.id,
          tenantId
        );
      if (checkExits) {
        throw new AppException(ResponseCode.STATUS_8013_USER_ALREADY_EXIST);
      }

      //create user role
      const userRole = new UserRole();
      userRole.roleId = RoleId[inviteUserToTenantDTO.role];
      userRole.tenantId = tenantId;
      userRole.userId = targetUser.id;
      userRole.createdBy = user.id;

      await this.userRoleRepository.createUserRole(userRole);

      //create user tenant
      const userTenant = new UserTenant();
      userTenant.userId = targetUser.id;
      userTenant.tenantId = tenantId;
      userTenant.createdBy = user.id;
      await this.userTenantRepository.createUserTenant(userTenant);

      //TODO: send invite email
    } else {
      //TODO: send invite email with create account link
    }
    return true;
  }
}
