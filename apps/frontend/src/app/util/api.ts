import axios from 'axios';
import Cookies from 'js-cookie';
import { AppSlice } from './store/appSlice';
import { useAppStore } from './store/store';
class API {
  static apiInstance: any;
  static API_PATH: {
    AUTH: {
      LOGIN: string;
      REGISTER: string;
    };
    APP: {
      CREATE: string;
      SEARCH: string;
      GET_APP: (appId: string) => string;
      SEARCH_APP_VERSIONS: (appId: string) => string;
      GET_APP_VERSION_TAGS: (appId: string) => string;
      UPDATE_APP: (appId: string) => string;
      GET_API_KET: (appId: string) => string;
      UPLOAD_APP_VERSION: (appId: string) => string;
      DELETE_VERSION: (appId: string, versionId: string) => string;
      PUBLIC_INSTALL_PAGE_APP_DETAILS: (appId: string) => string;
      PUBLIC_INSTALL_PAGE_APP_VERSIONS: (
        appId: string,
        versionId: string
      ) => string;
    };
    SETTING: {
      GET_ALL_SETTINGS: string;
      GET_SETTING: (key: string) => string;
      CREATE_SETTING: string;
      UPDATE_SETTING: string;
    };
    CREDENTIAL: {
      GET_ALL_CREDENTIALS: string;
      GET_CREDENTIAL: (id: string) => string;
      CREATE_CREDENTIAL: string;
      UPDATE_CREDENTIAL: (id: string) => string;
      DELETE_CREDENTIAL: (id: string) => string;
      GET_ALL_CREDENTIAL_COMPONENTS: string;
      GET_CREDENTIAL_COMPONENT: (name: string) => string;
    };
  };
  static auth: {
    login: (email: string, password: string) => Promise<any>;
    register: (email: string, password: string, name: string) => Promise<any>;
  };
  static app: {
    createApp: (data: {
      name: string;
      description: string;
      icon: File;
      extra: {
        [key: string]: any;
      };
    }) => Promise<any>;
    searchApp: (data: {
      page: number;
      limit: number;
      query: string;
    }) => Promise<any>;
    appVersions: (appId: string) => Promise<any>;
    getApp: (appId: string) => Promise<any>;
    getAppVersionTags: (appId: string) => Promise<any>;
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
    ) => Promise<any>;
    getAPIKey: (appId: string) => Promise<any>;
    uploadAppVersion: (
      appId: string,
      data: {
        name: string;
        description: string;
        file: File;
        apiKey: string;
        tags: string;
        installPassword: string;
      }
    ) => Promise<any>;
    deleteVersion: (appId: string, versionId: string) => Promise<any>;
    publicInstallPageAppDetails: (appId: string) => Promise<any>;
    publicInstallPageAppVersion: (
      appId: string,
      versionId: string,
      installPassword: string
    ) => Promise<any>;
  };
  static setting: {
    getAllSettings: () => Promise<any>;
    getSetting: (key: string) => Promise<any>;
    createSetting: (data: {
      key: string;
      config: Record<string, unknown>;
    }) => Promise<any>;
    updateSetting: (data: {
      id: string;
      key: string;
      config: Record<string, unknown>;
    }) => Promise<any>;
  };
  static credential: {
    getAllCredentials: () => Promise<any>;
    getCredential: (key: string) => Promise<any>;
    createCredential: (data: {
      key: string;
      config: Record<string, unknown>;
    }) => Promise<any>;
    updateCredential: (data: {
      id: string;
      config: Record<string, unknown>;
    }) => Promise<any>;
    deleteCredential: (key: string) => Promise<any>;
    getAllCredentialComponents: () => Promise<any>;
    getCredentialComponent: (name: string) => Promise<any>;
  };

  static {
    this.apiInstance = axios.create({
      baseURL: import.meta.env.VITE_API_HOST,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NODE_ENV === 'development' && {
          'Access-Control-Allow-Origin': '*',
        }),
      },
    });

    this.apiInstance.defaults.withCredentials = true;
    /**
     * Set Authorization Headers
     */
    this.apiInstance.interceptors.request.use(
      (config: { headers: { [x: string]: string } }) => {
        const token = Cookies.get('API_TOKEN');
        // console.log("token=" + token);
        if (token) {
          if (config && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      }
    );

    /**
     * Response handling
     */

    this.apiInstance.interceptors.response.use(
      (res: any) => {
        return Promise.resolve(res);
      },
      (err: { response: { status: number } }) => {
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

    this.API_PATH = {
      AUTH: {
        LOGIN: '/v1/auth/sign-in',
        REGISTER: '/v1/auth/sign-up',
      },
      APP: {
        CREATE: '/v1/app',
        SEARCH: '/v1/app/search',
        GET_APP: (appId: string) => `/v1/app/${appId}`,
        SEARCH_APP_VERSIONS: (appId: string) =>
          `/v1/app/${appId}/version/search`,
        GET_APP_VERSION_TAGS: (appId: string) =>
          `/v1/app/${appId}/version/tags`,
        UPDATE_APP: (appId: string) => `/v1/app/${appId}`,
        GET_API_KET: (appId: string) => `/v1/app/${appId}/api-key`,
        UPLOAD_APP_VERSION: (appId: string) => `/v1/app/${appId}/version`,
        DELETE_VERSION: (appId: string, versionId: string) =>
          `/v1/app/${appId}/version/${versionId}`,
        PUBLIC_INSTALL_PAGE_APP_DETAILS: (appId: string) =>
          `/v1/app/${appId}/install`,
        PUBLIC_INSTALL_PAGE_APP_VERSIONS: (appId: string, versionId: string) =>
          `/v1/app/${appId}/version/${versionId}/install`,
      },
      SETTING: {
        GET_ALL_SETTINGS: '/v1/setting',
        GET_SETTING: (key: string) => `/v1/setting/${key}`,
        CREATE_SETTING: '/v1/setting',
        UPDATE_SETTING: '/v1/setting',
      },
      CREDENTIAL: {
        GET_ALL_CREDENTIALS: '/v1/credential',
        GET_CREDENTIAL: (id: string) => `/v1/credential/${id}`,
        CREATE_CREDENTIAL: '/v1/credential',
        UPDATE_CREDENTIAL: (id: string) => `/v1/credential/${id}`,
        DELETE_CREDENTIAL: (id: string) => `/v1/credential/${id}`,
        GET_ALL_CREDENTIAL_COMPONENTS: '/v1/credential/component',
        GET_CREDENTIAL_COMPONENT: (name: string) =>
          `/v1/credential/component/${name}`,
      },
    };

    this.auth = {
      login: async (email: string, password: string) => {
        return this.apiInstance.post(this.API_PATH.AUTH.LOGIN, {
          username: email,
          password,
        });
      },
      register: async (email: string, password: string, name: string) => {
        return this.apiInstance.post(this.API_PATH.AUTH.REGISTER, {
          username: email,
          password,
          name,
        });
      },
    };

    this.app = {
      createApp: (data: {
        name: string;
        description: string;
        icon: File;
        extra: {
          [key: string]: any;
        };
      }) => {
        const { name, description, icon } = data;
        const form = new FormData();
        form.append('name', name);
        form.append('description', description);
        form.append('icon', icon);
        form.append('extra', JSON.stringify(data.extra));
        return this.apiInstance.post(this.API_PATH.APP.CREATE, form, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        });
      },
      searchApp: ({ page = 1, limit = 10, query }) => {
        return this.apiInstance.get(this.API_PATH.APP.SEARCH, {
          params: {
            page: page,
            limit: limit,
            query,
          },
        });
      },
      appVersions: (appId: string) => {
        return this.apiInstance.get(
          this.API_PATH.APP.SEARCH_APP_VERSIONS(appId)
        );
      },
      getApp: (appId: string) => {
        return this.apiInstance.get(this.API_PATH.APP.GET_APP(appId));
      },
      getAppVersionTags: (appId: string) => {
        return this.apiInstance.get(
          this.API_PATH.APP.GET_APP_VERSION_TAGS(appId)
        );
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
        form.append('name', name);
        form.append('description', description);
        if (icon) {
          form.append('icon', icon);
        }
        form.append('extra', JSON.stringify(data.extra));
        console.log(form);
        return this.apiInstance.put(this.API_PATH.APP.UPDATE_APP(appId), form, {
          headers: {
            'Content-type': 'multipart/form-data',
          },
        });
      },
      getAPIKey: (appId: string) => {
        return this.apiInstance.get(this.API_PATH.APP.GET_API_KET(appId));
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
        }
      ) => {
        const { name, description, file, apiKey, tags, installPassword } = data;
        const form = new FormData();
        form.append('name', name);
        form.append('description', description);
        form.append('file', file);
        form.append('apiKey', apiKey);
        form.append('tags', tags);
        form.append('installPassword', installPassword);
        return this.apiInstance.post(
          this.API_PATH.APP.UPLOAD_APP_VERSION(appId),
          form,
          {
            headers: {
              'Content-type': 'multipart/form-data',
            },
          }
        );
      },
      deleteVersion: (appId: string, versionId: string) => {
        return this.apiInstance.delete(
          this.API_PATH.APP.DELETE_VERSION(appId, versionId)
        );
      },
      publicInstallPageAppDetails: (appId: string) => {
        return this.apiInstance.get(
          this.API_PATH.APP.PUBLIC_INSTALL_PAGE_APP_DETAILS(appId)
        );
      },
      publicInstallPageAppVersion: (
        appId: string,
        versionId: string,
        password: string
      ) => {
        return this.apiInstance.post(
          this.API_PATH.APP.PUBLIC_INSTALL_PAGE_APP_VERSIONS(appId, versionId),
          { password }
        );
      },
    };

    this.setting = {
      getAllSettings: () => {
        return this.apiInstance.get(this.API_PATH.SETTING.GET_ALL_SETTINGS);
      },
      getSetting: (key: string) => {
        return this.apiInstance.get(this.API_PATH.SETTING.GET_SETTING(key));
      },
      createSetting: (data: {
        key: string;
        config: Record<string, unknown>;
      }) => {
        return this.apiInstance.post(
          this.API_PATH.SETTING.CREATE_SETTING,
          data
        );
      },
      updateSetting: (data: {
        id: string;
        key: string;
        config: Record<string, unknown>;
      }) => {
        return this.apiInstance.put(this.API_PATH.SETTING.UPDATE_SETTING, data);
      },
    };

    this.credential = {
      getAllCredentials: () => {
        return this.apiInstance.get(
          this.API_PATH.CREDENTIAL.GET_ALL_CREDENTIALS
        );
      },
      getCredential: (id: string) => {
        return this.apiInstance.get(
          this.API_PATH.CREDENTIAL.GET_CREDENTIAL(id)
        );
      },
      createCredential: (data: any) => {
        return this.apiInstance.post(
          this.API_PATH.CREDENTIAL.CREATE_CREDENTIAL,
          data
        );
      },
      updateCredential: (data: any) => {
        return this.apiInstance.put(
          this.API_PATH.CREDENTIAL.UPDATE_CREDENTIAL(data.id),
          data
        );
      },
      deleteCredential: (id: string) => {
        return this.apiInstance.delete(
          this.API_PATH.CREDENTIAL.DELETE_CREDENTIAL(id)
        );
      },
      getAllCredentialComponents: () => {
        return this.apiInstance.get(
          this.API_PATH.CREDENTIAL.GET_ALL_CREDENTIAL_COMPONENTS
        );
      },
      getCredentialComponent: (name: string) => {
        return this.apiInstance.get(
          this.API_PATH.CREDENTIAL.GET_CREDENTIAL_COMPONENT(name)
        );
      },
    };
  }
}

export default API;
