import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { hashPassword } from '../common/util/password.util';
import { Admin } from '../modules/admin/entities/admin.entity';
import { AdminStatus } from '../modules/admin/enum/admin.status.enum';
import { App } from '../modules/app/entities/app.entity';
import { AppTag } from '../modules/app/entities/app.tag.entity';
import { AppVersion } from '../modules/app/entities/app.version.entity';
import { AppVersionTag } from '../modules/app/entities/app.version.tag.entity';
import { CredentialComponent } from '../modules/credential/entities/credential.component.entity';
import { Credential } from '../modules/credential/entities/credential.entity';
import { File } from '../modules/file/entities/file.entity';
import { Permission } from '../modules/permission/entities/permission.entity';
import { Role } from '../modules/role/entities/role.entity';
import { RoleId } from '../modules/role/enum/role.id.enum';
import { Setting } from '../modules/setting/entities/setting.entity';
import { Tenant } from '../modules/tenant/entities/tenant.entity';
import { TenantStatus } from '../modules/tenant/enum/tenant.status.enum';
import { User } from '../modules/user/entities/user.entity';
import { UserPermission } from '../modules/user/entities/user.permission.entity';
import { UserProfile } from '../modules/user/entities/user.profile.entity';
import { UserRefreshToken } from '../modules/user/entities/user.refresh.token.entity';
import { UserRole } from '../modules/user/entities/user.role.entity';
import { UserTenant } from '../modules/user/entities/user.tenant.entity';
import { UserStatus } from '../modules/user/enum/user.status.enum';
import { Role1693123446947 } from './migrations/1693123446947-create-role';
import { role1693123446948 } from './migrations/1693123446948-role';
import { Permission1693145873440 } from './migrations/1693145873440-permission';
import { PermissionInsert1693145971058 } from './migrations/1693145971058-permission-insert';
import { CreateCredentialComponent1694362620123 } from './migrations/1694362620123-CreateCredentialComponent';
import { CreateSetting1695107265137 } from './migrations/1695107265137-Create-Setting';
import { InsertSystemConfig1695658100920 } from './migrations/1695658100920-Insert-SystemConfig';
import { InsertCredential1696162093605 } from './migrations/1696162093605-Insert-credential';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          database: configService.get('db.database'),
          url: configService.get('db.url'),
          entities: [
            Admin,
            App,
            AppVersion,
            AppTag,
            AppVersionTag,
            File,
            Setting,
            User,
            UserProfile,
            UserRefreshToken,
            Role,
            UserRole,
            Permission,
            UserPermission,
            Credential,
            CredentialComponent,
            Tenant,
            UserTenant,
            Setting,
          ],
          synchronize: configService.get('db.synchronize'),
          migrations: [
            Role1693123446947,
            role1693123446948,
            Permission1693145873440,
            PermissionInsert1693145971058,
            CreateCredentialComponent1694362620123,
            InsertCredential1696162093605,
            CreateSetting1695107265137,
            InsertSystemConfig1695658100920,
          ],
          migrationsRun: configService.get('db.migrationsRun'),
          logging: configService.get('db.logging'),
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
class DatabaseModule {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService
  ) {}

  async onModuleInit() {
    await this.createAdmin();
    await this.createTenant();
    await this.createTenantUser();
  }

  async createTenant() {
    //[Create Tenant]
    const { enabled, name, domainName } = this.configService.get<{
      enabled: boolean;
      name: string;
      username: string;
      password: string;
      domainName: string;
    }>('static.defaultTenant');

    if (!enabled) {
      Logger.log('Disabled Create default tenant.');
      return;
    }
    Logger.log('Enabled Create default tenant.');
    //Check if the tenant already exists
    const tenant = await this.dataSource.getRepository(Tenant).findOne({
      where: {
        domainName,
      },
    });
    if (tenant) {
      Logger.log(`Tenant ${domainName} already exists.`);
      return;
    }

    Logger.log('Creating default tenant...');
    const newTenant = new Tenant();
    newTenant.name = name;
    newTenant.domainName = domainName;
    newTenant.status = TenantStatus.Active;
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Tenant)
      .values([newTenant])
      .execute();
    Logger.log(`Tenant ${newTenant.name} created!`);
    Logger.debug(result.raw);
  }

  async createTenantUser() {
    //[Create user]
    const { name, domainName, username, password } = this.configService.get<{
      enabled: boolean;
      name: string;
      username: string;
      password: string;
      domainName: string;
    }>('static.defaultTenant');
    //Check if the user already exists
    const user = await this.dataSource.getRepository(User).findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      Logger.log(`User ${username} already exists.`);
      return;
    }

    Logger.log('Creating default tenant user...');
    const tenant = await this.dataSource.getRepository(Tenant).findOne({
      where: {
        domainName,
      },
    });

    //Create user
    const newUser = new User();
    newUser.username = username;
    newUser.status = UserStatus.Activated;
    newUser.password = await hashPassword(password);
    const result2 = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([newUser])
      .execute();

    //Create Profile for user
    const profile = new UserProfile();
    profile.userId = result2.raw[0].id;
    profile.name = name;
    profile.email = username;
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserProfile)
      .values([profile])
      .execute();

    //Assign tenant to user
    const userTenant = new UserTenant();
    userTenant.userId = result2.raw[0].id;
    userTenant.tenantId = tenant.id;
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserTenant)
      .values([userTenant])
      .execute();

    //Assign admin role to user
    const userRole = new UserRole();
    userRole.roleId = RoleId.ADMIN;
    userRole.userId = result2.raw[0].id;
    userRole.tenantId = tenant.id;
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values([userRole])
      .execute();

    //permissions [As admin user will able to view all app]
    // const viewAllAppPermission = new UserPermission();
    // viewAllAppPermission.permissionId = PermissionEnum.VIEW_ALL_APP;
    // viewAllAppPermission.userId = result2.raw[0].id;
    // viewAllAppPermission.refId = tenant.id;
    // const editAllAppPermission = new UserPermission();
    // editAllAppPermission.permissionId = PermissionEnum.EDIT_ALL_APP;
    // editAllAppPermission.userId = result2.raw[0].id;
    // editAllAppPermission.refId = tenant.id;
    // const deleteAllAppVersionPermission = new UserPermission();
    // deleteAllAppVersionPermission.permissionId =
    //   PermissionEnum.DELETE_ALL_APP_VERSION;
    // deleteAllAppVersionPermission.userId = result2.raw[0].id;
    // deleteAllAppVersionPermission.refId = tenant.id;
    // const createAllAppVersionPermission = new UserPermission();
    // createAllAppVersionPermission.permissionId =
    //   PermissionEnum.CREATE_ALL_APP_VERSION;
    // createAllAppVersionPermission.userId = result2.raw[0].id;
    // createAllAppVersionPermission.refId = tenant.id;
    // await this.dataSource
    //   .createQueryBuilder()
    //   .insert()
    //   .into(UserPermission)
    //   .values([
    //     viewAllAppPermission,
    //     editAllAppPermission,
    //     deleteAllAppVersionPermission,
    //     createAllAppVersionPermission,
    //   ])
    //   .execute();

    Logger.log(`Tenant user ${result2.raw[0].name} created!`);
  }

  async createAdmin() {
    //[Create admin]
    const { enabled, name, username, password } = this.configService.get<{
      enabled: boolean;
      name: string;
      username: string;
      password: string;
    }>('static.defaultAdministrator');
    if (!enabled) {
      Logger.log('Disabled Create default admin.');
      return;
    }
    Logger.log('Enabled Create default admin.');

    //Check if the admin already exists
    const admin = await this.dataSource.getRepository(Admin).findOne({
      where: {
        email: username,
      },
    });
    if (admin) {
      Logger.log(`Admin ${admin.email} already exists.`);
      return;
    }

    Logger.log('Creating default admin...');
    const newAdmin = new Admin();
    newAdmin.name = name;
    newAdmin.email = username;
    newAdmin.status = AdminStatus.Active;
    newAdmin.password = await hashPassword(password);
    const result = await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(Admin)
      .values([newAdmin])
      .execute();
    Logger.log(`Admin ${newAdmin.name} created!`);
    Logger.debug(result.raw);
  }
}

export default DatabaseModule;
