/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { AppSlice } from './store/appSlice';
import { useAppStore } from './store/store';
import { UserStatus } from './type/UserStatus';
import { RoleType } from './type/RoleType';
import { PortalUserProfile } from './type/PortalUserProfile';
import { ResponseStatus } from './type/ResponseStatus';
import { SearchJiraIssue } from './type/SearchJiraIssue';

const API = {
  apiInstance: axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...(import.meta.env.NODE_ENV === 'development' && {
        'Access-Control-Allow-Origin': '*',
      }),
    },
  }),

  API_PATH: {
    AUTH: {
      LOGIN: '/v1/auth/sign-in',
      REGISTER: '/v1/auth/sign-up',
    },
    APP: {
      CREATE: '/v1/portal/app',
      SEARCH: '/v1/portal/app/search',
      GET_APP: (appId: string) => `/v1/portal/app/${appId}`,
      SEARCH_APP_VERSIONS: (appId: string) =>
        `/v1/portal/app/${appId}/version/search`,
      GET_APP_VERSION_TAGS: (appId: string) =>
        `/v1/portal/app/${appId}/version/tags`,
      UPDATE_APP: (appId: string) => `/v1/portal/app/${appId}`,
      GET_API_KET: (appId: string) => `/v1/portal/app/${appId}/api-key`,
      UPLOAD_APP_VERSION: (appId: string) => `/v1/portal/app/${appId}/version`,
      DELETE_VERSION: (appId: string, versionId: string) =>
        `/v1/portal/app/${appId}/version/${versionId}`,
      PUBLIC_INSTALL_PAGE_APP_DETAILS: (appId: string) =>
        `/v1/portal/app/${appId}/install`,
      PUBLIC_INSTALL_PAGE_APP_VERSIONS: (appId: string, versionId: string) =>
        `/v1/portal/app/${appId}/version/${versionId}/install`,
      SEARCH_JIRA_ISSUES: (appId: string) =>
        `/v1/portal/app/${appId}/jira/search`,
      REMOVE_JIRA_ISSUE: (appId: string, version: string, issueId: string) =>
        `/v1/portal/app/${appId}/version/${version}/jira/issue/${issueId}/remove`,
    },
    USER: {
      SEARCH_USERS: (tenantId: string) =>
        `/v1/portal/user/tenant/${tenantId}/search`,
      GET_USER: (userId: string) => `/v1/portal/user/${userId}`,
      UPDATE_USER_STATUS: (userId: string) =>
        `/v1/portal/user/${userId}/status`,
      CREATE_USER: '/v1/portal/user',
      PROFILE: '/v1/portal/user',
      UPDATE_PROFILE: '/v1/portal/user',
      TENANTS: '/v1/portal/user/tenants',
      APP_PERMISSIONS_LIST: (appId: string) =>
        `/v1/portal/user/app/${appId}/permissions`,
      ADD_APP_PERMISSIONS: (userId: string) =>
        `v1/portal/user/${userId}/permission`,
    },
    SETTING: {
      GET_ALL_SETTINGS: '/v1/portal/setting',
      GET_SETTING: (key: string) => `/v1/portal/setting/${key}`,
      CREATE_SETTING: '/v1/portal/setting',
      UPDATE_SETTING: '/v1/portal/setting',
    },
    CREDENTIAL: {
      GET_ALL_CREDENTIALS: (tenantId: string) =>
        '/v1/portal/credential/tenant/' + tenantId,
      GET_CREDENTIAL: (id: string) => `/v1/portal/credential/${id}`,
      CREATE_CREDENTIAL: '/v1/portal/credential',
      UPDATE_CREDENTIAL: (id: string) => `/v1/portal/credential/${id}`,
      DELETE_CREDENTIAL: (id: string) => `/v1/portal/credential/${id}`,
      GET_ALL_CREDENTIAL_COMPONENTS: '/v1/portal/credential/component',
      GET_CREDENTIAL_COMPONENT: (name: string) =>
        `/v1/portal/credential/component/${name}`,
    },
  },

  auth: {
    login: async (email: string, password: string) => {
      return API.apiInstance.post(API.API_PATH.AUTH.LOGIN, {
        username: email,
        password,
      });
    },
    register: async (email: string, password: string, name: string) => {
      return API.apiInstance.post(API.API_PATH.AUTH.REGISTER, {
        username: email,
        password,
        name,
      });
    },
  },

  app: {
    createApp: (data: {
      name: string;
      description: string;
      icon: File;
      extra: {
        [key: string]: any;
      };
      tenantId: string;
    }) => {
      const { name, description, icon, tenantId } = data;
      const form = new FormData();
      form.append('name', name);
      form.append('description', description);
      form.append('tenantId', tenantId);
      form.append('icon', icon);
      form.append('extra', JSON.stringify(data.extra));
      return API.apiInstance.post(API.API_PATH.APP.CREATE, form, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
    },
    searchApp: ({
      page = 1,
      limit = 10,
      query,
    }: {
      page?: number;
      limit?: number;
      query?: string;
    }) => {
      return API.apiInstance.get(API.API_PATH.APP.SEARCH, {
        params: {
          page: page,
          limit: limit,
          query,
        },
      });
    },
    appVersions: (appId: string) => {
      return API.apiInstance.get(API.API_PATH.APP.SEARCH_APP_VERSIONS(appId));
    },
    getApp: (appId: string) => {
      return API.apiInstance.get(API.API_PATH.APP.GET_APP(appId));
    },
    getAppVersionTags: (appId: string) => {
      return API.apiInstance.get(API.API_PATH.APP.GET_APP_VERSION_TAGS(appId));
    },
    updateApp: (
      appId: string,
      data: {
        name: string;
        description: string;
        icon?: File | null;
        extra: {
          [key: string]: any;
        };
      }
    ) => {
      const { name, description, icon } = data;
      const form = new FormData();
      if (name) {
        form.append('name', name);
      }
      if (description) {
        form.append('description', description);
      }
      if (icon) {
        form.append('icon', icon);
      }
      form.append('extra', JSON.stringify(data.extra));
      console.log(form);
      return API.apiInstance.put(API.API_PATH.APP.UPDATE_APP(appId), form, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
    },
    patchApp: (
      appId: string,
      data: {
        name?: string;
        description?: string;
        icon?: File | null;
        extra: {
          [key: string]: any;
        };
      }
    ) => {
      const { name, description, icon } = data;
      const form = new FormData();
      if (name) {
        form.append('name', name);
      }
      if (description) {
        form.append('description', description);
      }
      if (icon) {
        form.append('icon', icon);
      }
      form.append('extra', JSON.stringify(data.extra));
      console.log(form);
      return API.apiInstance.patch(API.API_PATH.APP.UPDATE_APP(appId), form, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
    },
    getAPIKey: (appId: string) => {
      return API.apiInstance.get(API.API_PATH.APP.GET_API_KET(appId));
    },
    uploadAppVersion: (
      appId: string,
      data: {
        name: string;
        description: string;
        file: File;
        apiKey: string;
        tags: string;
        installPassword: string;
        jiraIssues?: string;
      }
    ) => {
      const {
        name,
        description,
        file,
        apiKey,
        tags,
        installPassword,
        jiraIssues,
      } = data;
      const form = new FormData();
      form.append('name', name);
      form.append('description', description);
      form.append('file', file);
      form.append('apiKey', apiKey);
      form.append('tags', tags);
      form.append('installPassword', installPassword);
      if (jiraIssues) {
        form.append('jiraIssues', jiraIssues);
      }
      return API.apiInstance.post(
        API.API_PATH.APP.UPLOAD_APP_VERSION(appId),
        form,
        {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        }
      );
    },
    deleteVersion: (appId: string, versionId: string) => {
      return API.apiInstance.delete(
        API.API_PATH.APP.DELETE_VERSION(appId, versionId)
      );
    },
    publicInstallPageAppDetails: (appId: string) => {
      return API.apiInstance.get(
        API.API_PATH.APP.PUBLIC_INSTALL_PAGE_APP_DETAILS(appId)
      );
    },
    publicInstallPageAppVersion: (
      appId: string,
      versionId: string,
      password: string
    ) => {
      return API.apiInstance.post(
        API.API_PATH.APP.PUBLIC_INSTALL_PAGE_APP_VERSIONS(appId, versionId),
        { password }
      );
    },
    searchJiraIssues: (
      appId: string,
      query: string
    ): Promise<
      AxiosResponse<{
        data: {
          items: SearchJiraIssue[];
        };
        status: ResponseStatus;
      }>
    > => {
      return API.apiInstance.get(API.API_PATH.APP.SEARCH_JIRA_ISSUES(appId), {
        params: {
          query,
        },
      });
    },
    removeJiraIssue: (appId: string, versionId: string, issueId: string) => {
      return API.apiInstance.delete(
        API.API_PATH.APP.REMOVE_JIRA_ISSUE(appId, versionId, issueId)
      );
    },
  },
  user: {
    searchUsers: (
      tenantId: string,
      {
        page = 1,
        limit = 10,
        query,
      }: {
        page?: number;
        limit?: number;
        query?: string;
      }
    ) => {
      return API.apiInstance.get(API.API_PATH.USER.SEARCH_USERS(tenantId), {
        params: {
          page: page,
          limit: limit,
          query,
        },
      });
    },
    getUser: (userId: string) => {
      return API.apiInstance.get(API.API_PATH.USER.GET_USER(userId));
    },
    updateUserStatus: (userId: string, status: UserStatus) => {
      return API.apiInstance.put(API.API_PATH.USER.UPDATE_USER_STATUS(userId), {
        status,
      });
    },
    createUser: (data: {
      email: string;
      password: string;
      name: string;
      username: string;
      roleTypes: RoleType[];
      permissions: string[];
      tenantIds: string[];
    }) => {
      return API.apiInstance.post(API.API_PATH.USER.CREATE_USER, {
        ...data,
        status: UserStatus.Activated,
      });
    },
    profile: () => {
      return API.apiInstance.get(API.API_PATH.USER.PROFILE);
    },
    updateProfile: ({
      name,
    }: {
      name: string;
    }): Promise<
      AxiosResponse<{
        data: PortalUserProfile;
        status: ResponseStatus;
      }>
    > => {
      return API.apiInstance.put(API.API_PATH.USER.UPDATE_PROFILE, {
        name,
      });
    },
    changePassword: ({
      password,
      oldPassword,
    }: {
      password: string;
      oldPassword: string;
    }): Promise<
      AxiosResponse<{
        data: PortalUserProfile;
        status: ResponseStatus;
      }>
    > => {
      return API.apiInstance.put(API.API_PATH.USER.UPDATE_PROFILE, {
        password,
        oldPassword,
      });
    },
    getAvailableTenants: () => {
      return API.apiInstance.get(API.API_PATH.USER.TENANTS);
    },
    getUserAppPermissionsList: (appId: string) => {
      return API.apiInstance.get(API.API_PATH.USER.APP_PERMISSIONS_LIST(appId));
    },
    addAppPermissions: ({
      userId,
      appId,
      permissions,
    }: {
      userId: string;
      appId: string;
      permissions: string[];
    }) => {
      return API.apiInstance.post(
        API.API_PATH.USER.ADD_APP_PERMISSIONS(userId),
        {
          appId,
          permissions,
        }
      );
    },
  },
  setting: {
    getAllSettings: () => {
      return API.apiInstance.get(API.API_PATH.SETTING.GET_ALL_SETTINGS);
    },
    getSetting: (key: string) => {
      return API.apiInstance.get(API.API_PATH.SETTING.GET_SETTING(key));
    },
    createSetting: (data: { key: string; config: Record<string, unknown> }) => {
      return API.apiInstance.post(API.API_PATH.SETTING.CREATE_SETTING, data);
    },
    updateSetting: (data: {
      id: string;
      key: string;
      config: Record<string, unknown>;
    }) => {
      return API.apiInstance.put(API.API_PATH.SETTING.UPDATE_SETTING, data);
    },
  },
  credential: {
    getAllCredentials: (tenantId: string, name?: string) => {
      return API.apiInstance.get(
        API.API_PATH.CREDENTIAL.GET_ALL_CREDENTIALS(tenantId),
        {
          params: {
            name,
          },
        }
      );
    },
    getCredential: (id: string) => {
      return API.apiInstance.get(API.API_PATH.CREDENTIAL.GET_CREDENTIAL(id));
    },
    createCredential: (data: {
      name: string;
      credentialName: string;
      encryptedData: Record<string, unknown>;
      tenantId: string;
    }) => {
      return API.apiInstance.post(
        API.API_PATH.CREDENTIAL.CREATE_CREDENTIAL,
        data
      );
    },
    updateCredential: (data: any) => {
      return API.apiInstance.put(
        API.API_PATH.CREDENTIAL.UPDATE_CREDENTIAL(data.id),
        data
      );
    },
    deleteCredential: (id: string) => {
      return API.apiInstance.delete(
        API.API_PATH.CREDENTIAL.DELETE_CREDENTIAL(id)
      );
    },
    getAllCredentialComponents: () => {
      return API.apiInstance.get(
        API.API_PATH.CREDENTIAL.GET_ALL_CREDENTIAL_COMPONENTS
      );
    },
    getCredentialComponent: (name: string) => {
      return API.apiInstance.get(
        API.API_PATH.CREDENTIAL.GET_CREDENTIAL_COMPONENT(name)
      );
    },
  },
};

API.apiInstance.defaults.withCredentials = true;

API.apiInstance.interceptors.request.use((config) => {
  const token = Cookies.get('API_TOKEN');
  if (token) {
    if (config && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

API.apiInstance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (err) => {
    if (err && err.response?.status === 401) {
      const { isLoggedIn, setLogout }: AppSlice = useAppStore.getState();
      if (isLoggedIn) {
        console.log('%c401 detected, logout now', 'color: #ff0000');
        setLogout();
      }
    }
    return Promise.reject(err);
  }
);

export default API;
