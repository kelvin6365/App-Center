import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { Tenant } from '../modules/tenant/entities/tenant.entity';
import { User } from '../modules/user/entities/user.entity';
import { UserProfile } from '../modules/user/entities/user.profile.entity';
import { UserTenant } from '../modules/user/entities/user.tenant.entity';
import { TenantStatus } from '../modules/tenant/enum/tenant.status.enum';
import { hashPassword } from '../common/util/password.util';
import { UserStatus } from '../modules/user/enum/user.status.enum';
import { RoleId } from '../modules/role/enum/role.id.enum';
import { UserRole } from '../modules/user/entities/user.role.entity';
import { UserProvider } from '../modules/user/entities/user.provider.entity';
import { AuthProvider } from '../modules/auth/enum/auth.provider.enum';
import { Admin } from '../modules/admin/entities/admin.entity';
import { AdminStatus } from '../modules/admin/enum/admin.status.enum';

@Global()
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
          entities: [join(__dirname, '../') + '**/**.entity{.ts,.js}'],
          synchronize: configService.get('db.synchronize'),
          migrations: [join(__dirname, 'migrations', 'scripts', '*.{ts,js}')],
          migrationsRun: configService.get('db.migrationsRun'),
          logging: configService.get('db.logging'),
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [Logger],
  exports: [],
})
class DatabaseModule {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.createAdmin();
    await this.createTenant();
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
    await this.createTenantUser();
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

    //Assign Provider to user
    const userProvider = new UserProvider();
    userProvider.provider = AuthProvider.LOCAL;
    userProvider.userId = result2.raw[0].id;
    await this.dataSource
      .createQueryBuilder()
      .insert()
      .into(UserProvider)
      .values([userProvider])
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
