import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { PageDTO } from '../../common/dto/page.dto';
import { AppException } from '../../common/response/app.exception';
import { ResponseCode } from '../../common/response/response.code';
import { hashPassword, isMatchPassword } from '../../common/util/password.util';
import { AppRepository } from '../../database/repositories/app.repository';
import { AppVersionRepository } from '../../database/repositories/app.version.repository';
import { AppVersionTagRepository } from '../../database/repositories/app.version.tag.repository';
import { CurrentUserDTO } from '../auth/dto/current.user.dto';
import { FileService } from '../file/file.service';
import { AppDTO } from './dto/app.dto';
import { AppVersionDTO } from './dto/app.version.dto';
import { AppVersionTagDTO } from './dto/app.version.tag.dto';
import { CreateAppDTO } from './dto/create.app.dto';
import { CreateAppVersionDTO } from './dto/create.app.version.dto';
import { InstallAppDTO } from './dto/install.app.dto';
import { UpdateAppDTO } from './dto/update.app.dto';
import { App } from './entities/app.entity';
import { AppVersion } from './entities/app.version.entity';
import { AppVersionTag } from './entities/app.version.tag.entity';
import { ResponseStatus } from '../../common/response/response.status';
import { PatchAppDTO } from './dto/patch.app.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly appRepository: AppRepository,
    private readonly appVersionRepository: AppVersionRepository,
    private readonly appVersionTagRepository: AppVersionTagRepository,
    private readonly fileService: FileService,
    private readonly configService: ConfigService
  ) {
    this.logger = new Logger('AppService');
  }

  //create a new app
  async createApp(
    app: CreateAppDTO,
    file: Express.Multer.File,
    user: CurrentUserDTO
  ): Promise<string> {
    //Check tenant id
    const isAllowed = user.tenants
      .map((ut) => ut.tenant.id)
      .includes(app.tenantId);
    if (!isAllowed) {
      throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    }
    this.logger.log('Creating a new app');
    //Create a new app by dto
    const newApp: App = new App();
    newApp.name = app.name;
    newApp.description = app.description;
    newApp.deletedAt = null;
    newApp.apiKey = nanoid();
    newApp.extra = app.extra ?? {};
    newApp.createdBy = user.id;
    newApp.tenantId = app.tenantId;
    const createdApp = await this.appRepository.createApp(newApp);
    if (createdApp) {
      //Create app icon
      const appIconFile = await this.fileService.uploadAppIcon(
        createdApp.id,
        file,
        createdApp.createdBy
      );
      createdApp.iconFileId = appIconFile.id;
      //TODO: User
      createdApp.updatedBy = null;
      await this.appRepository.updateApp(createdApp);
    }
    return createdApp.id;
  }

  //get all apps with pagination, filter tags and sorting
  async findAll(
    searchQuery = '',
    withDeleted = false,
    page = 1,
    limit = 10,
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ],
    user: CurrentUserDTO
  ): Promise<PageDTO<AppDTO>> {
    const userTenantsId = user.tenants.map((tenant) => tenant.tenant.id);

    const result = await this.appRepository.findAll(
      userTenantsId,
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
      ...result,
      items: result.items.map(
        (app) =>
          new AppDTO(
            app,
            app.iconFileId
              ? this.configService.get('services.file.fileAPI') + app.iconFileId
              : null
          )
      ),
    };
  }

  //get app by id
  async findById(
    id: string,
    withDeleted = false,
    errorIfNotFound = false,
    forPublicInstallPage = false,
    user?: CurrentUserDTO
  ): Promise<AppDTO> {
    const app = await this.appRepository.findById(id, withDeleted);
    if (!app && errorIfNotFound) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    // //check permissions
    // const permissions = user.permissions;
    // if (
    //   !permissions.filter((p) => p.permissionId === AppsPermission.VIEW_ALL_APP)
    // ) {
    //   if (
    //     !permissions
    //       .filter((p) => p.permissionId === AppsPermission.VIEW_APP)
    //       .map((p) => p.refId)
    //       .includes(app.id)
    //   ) {
    //     throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    //   }
    // } else {
    //   //view all apps permission also need to in same tenant
    //   if (!user.tenants.map((ut) => ut.tenant.id).includes(app.tenantId)) {
    //     throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    //   }
    // }
    return new AppDTO(
      forPublicInstallPage
        ? {
            name: app.name,
            description: app.description,
            iconFileId: app.iconFileId,
          }
        : app,
      app.iconFileId
        ? this.configService.get('services.file.fileAPI') + app.iconFileId
        : null
    );
  }

  //create new app version
  async createAppVersion(
    appId: string,
    appVersion: CreateAppVersionDTO,
    file: Express.Multer.File,
    user?: CurrentUserDTO
  ): Promise<boolean> {
    this.logger.log('Creating a new app version');
    const app = await this.appRepository.findById(appId);
    if (app) {
      //Check API Key
      if (app.apiKey !== appVersion.apiKey) {
        throw new AppException(ResponseCode.STATUS_3000_APP_API_KEY_NOT_MATCH);
      }
      const newAppVersion = new AppVersion();
      newAppVersion.appId = app.id;
      newAppVersion.name = appVersion.name;
      newAppVersion.description = appVersion.description;
      newAppVersion.installPassword = await hashPassword(
        appVersion.installPassword
      );
      // newAppVersion.createdBy = user.id;
      newAppVersion.createdBy = null;
      if (appVersion.tags) {
        newAppVersion.tags = appVersion.tags.map((tag) => {
          const newTag = new AppVersionTag();
          newTag.appVersion = newAppVersion;
          newTag.appId = app.id;
          newTag.name = tag;
          // newAppVersion.createdBy = user.id;
          newAppVersion.createdBy = null;
          return newTag;
        });
      }
      const createdAppVersion =
        await this.appVersionRepository.createAppVersion(newAppVersion);
      if (createdAppVersion) {
        const appFile = await this.fileService.unloadAppFile(
          createdAppVersion.id,
          file,
          // user.id
          null
        );
        createdAppVersion.fileId = appFile.id;
        // createdAppVersion.updatedBy = user.id;
        createdAppVersion.updatedBy = null;
        await this.appVersionRepository.updateAppVersion(createdAppVersion);
        return true;
      }
    }
  }

  //get app versions
  async getAllAppVersions(
    appId: string,
    searchQuery = '',
    withDeleted = false,
    filters: { key: string; values: string | boolean | any[] | number[] }[],
    sorts: { key: string; value: 'ASC' | 'DESC' }[] = [
      { key: 'createdAt', value: 'DESC' },
    ],
    user: CurrentUserDTO
  ) {
    // //check permissions
    // const permissions = user.permissions;
    // if (
    //   !permissions
    //     .filter((p) => p.permissionId === AppsPermission.VIEW_APP)
    //     .map((p) => p.refId)
    //     .includes(appId)
    // ) {
    //   throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    // }

    const appVersions = await this.appVersionRepository.getAllAppVersions(
      appId,
      searchQuery,
      withDeleted,
      filters,
      sorts
    );
    for (let i = 0; i < appVersions.length; i++) {
      const appVersion = appVersions[i];
      //find app version tags by app version id
      const appVersionTags =
        await this.appVersionTagRepository.getAllTagsByAppVersionId(
          appVersion.id
        );
      appVersion.tags = appVersionTags;
    }
    return appVersions.map(
      (appVersion) =>
        new AppVersionDTO(
          appVersion,
          appVersion.fileId
            ? this.configService.get('services.file.fileAPI') +
              appVersion.fileId +
              '&download=true'
            : null
        )
    );
  }

  //get all app version tags by app id
  async getAllAppVersionTags(
    appId: string,
    user: CurrentUserDTO
  ): Promise<AppVersionTagDTO[]> {
    // //check permissions
    // const permissions = user.permissions;
    // if (
    //   !permissions
    //     .filter((p) => p.permissionId === AppsPermission.VIEW_APP)
    //     .map((p) => p.refId)
    //     .includes(appId)
    // ) {
    //   throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    // }

    const appVersionTags = await this.appVersionTagRepository.getAllTagsByAppId(
      appId
    );
    return appVersionTags.map(
      (appVersionTag) => new AppVersionTagDTO(appVersionTag)
    );
  }

  //update app
  async updateApp(
    id: string,
    app: UpdateAppDTO,
    file: Express.Multer.File,
    user: CurrentUserDTO
  ): Promise<boolean> {
    // //check permissions
    // const permissions = user.permissions;
    // if (
    //   !permissions
    //     .filter((p) => p.permissionId === AppsPermission.EDIT_APP)
    //     .map((p) => p.refId)
    //     .includes(id)
    // ) {
    //   throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    // }

    this.logger.log('Updating an app');
    const appToUpdate = await this.appRepository.findById(id);
    if (appToUpdate) {
      appToUpdate.name = app.name;
      appToUpdate.description = app.description;
      appToUpdate.extra = app.extra
        ? { ...appToUpdate.extra, ...app.extra }
        : {};
      appToUpdate.updatedBy = user.id;
      const updatedApp = await this.appRepository.updateApp(appToUpdate);
      if (file) {
        //Update app icon
        const oldFileId = appToUpdate.iconFileId;
        const appIconFile = await this.fileService.uploadAppIcon(
          updatedApp.id,
          file,
          user.id
        );
        updatedApp.iconFileId = appIconFile.id;
        //delete old icon file
        await this.fileService.deleteFile(oldFileId, user.id);
        await this.appRepository.updateApp(updatedApp);
      }
      return true;
    } else {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
  }

  //patch app
  async patchApp(
    id: string,
    app: PatchAppDTO,
    file: Express.Multer.File,
    user: CurrentUserDTO
  ): Promise<boolean> {
    // //check permissions
    // const permissions = user.permissions;
    // if (
    //   !permissions
    //     .filter((p) => p.permissionId === AppsPermission.EDIT_APP)
    //     .map((p) => p.refId)
    //     .includes(id)
    // ) {
    //   throw new AppException(ResponseCode.STATUS_8003_PERMISSION_DENIED);
    // }

    this.logger.log('Patching an app');
    const appToUpdate = await this.appRepository.findById(id);
    if (appToUpdate) {
      if (app.name) {
        appToUpdate.name = app.name;
      }
      if (app.description) {
        appToUpdate.description = app.description;
      }
      appToUpdate.extra = app.extra
        ? { ...appToUpdate.extra, ...app.extra }
        : {};
      appToUpdate.updatedBy = user.id;
      const updatedApp = await this.appRepository.updateApp(appToUpdate);
      if (file) {
        //Update app icon
        const oldFileId = appToUpdate.iconFileId;
        const appIconFile = await this.fileService.uploadAppIcon(
          updatedApp.id,
          file,
          user.id
        );
        updatedApp.iconFileId = appIconFile.id;
        //delete old icon file
        await this.fileService.deleteFile(oldFileId, user.id);
        await this.appRepository.updateApp(updatedApp);
      }
      return true;
    } else {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
  }

  //get app api key
  async getApiKey(appId: string): Promise<string> {
    const app = await this.appRepository.findById(appId);
    if (app) {
      return app.apiKey;
    } else {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
  }

  //get app for install
  async getInstallApp(
    appId: string,
    appVersionId: string,
    password: string
  ): Promise<InstallAppDTO> {
    const version = await this.appVersionRepository.getAppVersion(appVersionId);
    if (!version || version?.appId !== appId) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    if (!(await isMatchPassword(password, version.installPassword))) {
      throw new AppException(ResponseCode.STATUS_1014_INVALID_INSTALL_PASSWORD);
    }
    const app = await this.appRepository.findById(appId);
    const appVersionTags =
      await this.appVersionTagRepository.getAllTagsByAppVersionId(version.id);
    return new InstallAppDTO(
      new AppDTO(
        {
          id: app.id,
          name: app.name,
          description: app.description,
          iconFileId: app.iconFileId,
        },
        app.iconFileId
          ? this.configService.get('services.file.fileAPI') + app.iconFileId
          : null
      ),
      new AppVersionDTO(
        {
          ...version,
          tags: appVersionTags,
        },
        version.fileId
          ? this.configService.get('services.file.publicAPI') +
            '/v1/app/' +
            app.id +
            '/version/' +
            version.id +
            '/install'
          : null
      )
    );
  }

  async validateInstallPassword(
    appVersionId: string,
    password: string
  ): Promise<AppVersion> {
    const version = await this.appVersionRepository.getAppVersion(appVersionId);
    if (!version) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    if (!(await isMatchPassword(password, version.installPassword))) {
      throw new AppException(ResponseCode.STATUS_1014_INVALID_INSTALL_PASSWORD);
    }
    const app = await this.appRepository.findById(version.appId);
    if (!app) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    return version;
  }

  //delete app version
  async deleteAppVersion(
    appId: string,
    appVersionId: string,
    user: CurrentUserDTO
  ): Promise<boolean> {
    const app = await this.appRepository.findById(appId);
    if (!app) {
      throw new AppException(ResponseCode.STATUS_1011_NOT_FOUND);
    }
    await this.appVersionRepository.deleteAppVersion(appVersionId, user.id);
    return true;
  }
}
