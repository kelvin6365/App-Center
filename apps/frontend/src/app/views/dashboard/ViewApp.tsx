import { Card, IconButton, Typography } from '@material-tailwind/react';
import axios from 'axios';
import classNames from 'classnames';
import { Tooltip } from 'flowbite-react';
import { useCallback, useEffect, useState } from 'react';
import { BiLogoPlayStore, BiEdit, BiLogoGitlab } from 'react-icons/bi';
import { FaKey, FaCloudUploadAlt } from 'react-icons/fa';
import { GrAppleAppStore } from 'react-icons/gr';
import { IoIosCopy } from 'react-icons/io';
import { SiPostman, SiJirasoftware, SiConfluence } from 'react-icons/si';
import { TiTick } from 'react-icons/ti';
import { BsGit } from 'react-icons/bs';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import Tag from '../../../components/Chip/Tag';
import PostmanDialog from '../../../components/Dialog/PostmanDialog';
import QRCodeDialog from '../../../components/Dialog/QRCodeDialog';
import AppVersionTable from '../../../components/Table/AppVersionTable';
import API from '../../util/api';
import { App } from '../../util/type/App';
import { AppVersion, AppVersionTag } from '../../util/type/AppVersion';
import { maskingString } from '../../util/util';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import EditAppDialog from '../../../components/Dialog/EditAppDialog';
import GitLabCIDialog from '../../../components/Dialog/GitLabCIDialog';
import UploadAppVersionDialog from '../../../components/Dialog/UploadAppVersionDialog';

const ViewApp = () => {
  const { appId } = useParams();
  const [app, setApp] = useState<App | null>(null);
  const [copied, setCopied] = useState(false);
  const [openPostman, setOpenPostman] = useState(false);
  const [openQRCode, setOpenQRCode] = useState({
    open: false,
    data: '',
  });
  const [openGitLab, setOpenGitLab] = useState(false);
  const [openEditApp, setOpenEditApp] = useState(false);
  const [openUploadVersion, setOpenUploadVersion] = useState(false);

  const [appVersions, setAppVersions] = useState<AppVersion[]>([]);
  const [appVersionTags, setAppVersionTags] = useState<AppVersionTag[]>([]);
  //selected Tags
  const [selectedTags, setSelectedTags] = useState<AppVersionTag[]>([]);

  //Call API to get app version tags
  const fetchAppVersionTags = useCallback(async (appId: string) => {
    if (appId == null) {
      return;
    }
    try {
      const res = await API.app.getAppVersionTags(appId);
      const { data }: { data: AppVersionTag[] } = res.data;
      setAppVersionTags(data);
      setSelectedTags(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, []);

  const fetchAppVersion = useCallback(async (appId: string) => {
    if (appId == null) {
      return;
    }
    try {
      const res = await API.app.appVersions(appId);
      const { data }: { data: AppVersion[] } = res.data;
      setAppVersions(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, []);

  //get app
  const fetchApp = useCallback(async (appId: string) => {
    try {
      const res = await API.app.getApp(appId);
      const { data } = res.data;
      setApp(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, []);

  //get API Key
  const getAPIKey = async () => {
    if (!app) {
      return;
    }
    try {
      const res = await API.app.getAPIKey(app.id);
      const { data } = res.data;
      setCopied(true);
      navigator.clipboard.writeText(data ?? '');
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    if (appId) {
      fetchApp(appId).then(() => {
        fetchAppVersionTags(appId).then(() => {
          fetchAppVersion(appId);
        });
      });
    }
  }, [appId, fetchApp, fetchAppVersion, fetchAppVersionTags]);

  return (
    <div>
      <DefaultBreadcrumb pageName={'Dashboard.All Apps.' + app?.name ?? '-'} />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          {app?.name ?? '-'}
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          {app?.description ?? '-'}
        </Typography>
      </div>
      <div className="flex flex-wrap py-4 md:flex-nowrap sm:space-x-6">
        <Card shadow={false} className={classNames('w-[180px] m-auto md:m-0')}>
          <LazyLoadImage
            className="max-w-full rounded-lg border min-w-[180px] w-[180px] h-[170px] sm:h-[180px]"
            src={app?.iconFileURL}
            alt={app?.name}
            placeholder={
              <div className="max-w-full rounded-lg border w-[180px] h-[170px] sm:h-[180px] animate-pulse bg-blue-gray-200/30"></div>
            }
            effect="opacity"
          />
          <div className="flex my-2 mt-4">
            <span
              className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 cursor-pointer rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
              onClick={() => {
                if (!copied) {
                  getAPIKey();
                }
              }}
            >
              {!copied ? (
                <FaKey />
              ) : (
                <Tooltip content="Copied" trigger="hover">
                  <div className="relative">
                    <IoIosCopy />
                    <TiTick className="absolute right-[-8px] bottom-[-8px] text-green-400" />
                  </div>{' '}
                </Tooltip>
              )}
            </span>
            <input
              type="text"
              id="website-admin"
              className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={
                app?.apiKey
                  ? maskingString(app.apiKey, 4, app.apiKey.length)
                  : ''
              }
              readOnly
            />
          </div>
          <div className="my-2 border border-gray-200 rounded bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
            <Typography className="px-4 pt-4 font-normal text-blue-gray-400">
              Quick Access
            </Typography>
            <div className="grid grid-cols-3 gap-2 p-4">
              {/* Apple Store */}
              <IconButton
                className="bg-white text-cyan-500"
                onClick={() => {
                  if (app?.extra?.appStoreURL) {
                    window.open(app.extra.appStoreURL, '_blank');
                  } else {
                    toast.info('App Store URL is not set');
                  }
                }}
              >
                <GrAppleAppStore className="w-5 h-5" />
              </IconButton>

              {/* Play Store */}
              <IconButton
                className="bg-white text-cyan-500"
                onClick={() => {
                  if (app?.extra?.playStoreURL) {
                    window.open(app.extra.playStoreURL, '_blank');
                  } else {
                    toast.info('Play Store URL is not set');
                  }
                }}
              >
                <BiLogoPlayStore className="w-5 h-5" />
              </IconButton>

              {/* Project Git */}
              <IconButton
                className="text-orange-500 bg-white"
                onClick={() => {
                  if (app?.extra?.repoURL) {
                    window.open(app.extra.repoURL, '_blank');
                  } else {
                    toast.info('Git Repository URL is not set');
                  }
                }}
              >
                <BsGit className="w-5 h-5" />
              </IconButton>

              {/* Postman */}
              <IconButton
                className="text-orange-500 bg-white"
                onClick={() => {
                  setOpenPostman(true);
                }}
              >
                <SiPostman className="w-5 h-5" />
              </IconButton>

              {/* GitLab CI */}
              <IconButton
                className="text-orange-500 bg-white"
                onClick={() => {
                  setOpenGitLab(true);
                }}
              >
                <BiLogoGitlab className="w-5 h-5" />
              </IconButton>

              {/* Jira */}
              <IconButton
                className="text-blue-500 bg-white"
                onClick={() => {
                  if (app?.extra?.jiraURL) {
                    window.open(app.extra.jiraURL, '_blank');
                  } else {
                    toast.info('Jira URL is not set');
                  }
                }}
              >
                <SiJirasoftware className="w-5 h-5" />
              </IconButton>

              {/* Confluence */}
              <IconButton
                className="text-blue-500 bg-white"
                onClick={() => {
                  if (app?.extra?.confluenceURL) {
                    window.open(app.extra.confluenceURL, '_blank');
                  } else {
                    toast.info('Confluence URL is not set');
                  }
                }}
              >
                <SiConfluence className="w-5 h-5" />
              </IconButton>

              {/* Upload New Version */}
              <IconButton
                className="text-gray-500 bg-white"
                onClick={() => {
                  setOpenUploadVersion(true);
                }}
              >
                <FaCloudUploadAlt className="w-5 h-5" />
              </IconButton>

              {/* Edit App */}
              <IconButton
                className="text-gray-500 bg-white"
                onClick={() => {
                  setOpenEditApp(true);
                }}
              >
                <BiEdit className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </Card>
        <div className="w-full overflow-auto">
          <div className="flex flex-wrap p-2 mb-2 border border-gray-300 rounded">
            {appVersionTags.map((tag) => {
              return (
                <Tag
                  key={tag.id}
                  onClick={() => {
                    if (selectedTags.find((t) => t.name === tag.name)) {
                      setSelectedTags(
                        selectedTags.filter((t) => t.name !== tag.name)
                      );
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                    if (appId) {
                      fetchAppVersion(appId);
                    }
                  }}
                  className={'normal-case cursor-pointer my-2 mx-1'}
                  value={tag.name}
                  color={
                    !selectedTags.find((t) => t.name === tag.name)
                      ? 'gray'
                      : 'blue'
                  }
                  variant={'outlined'}
                />
              );
            })}
          </div>
          <AppVersionTable
            appVersions={appVersions}
            selectedTags={selectedTags}
            setOpenQRCode={setOpenQRCode}
          />
        </div>
      </div>
      {app && (
        <PostmanDialog
          title={'Postman'}
          onClose={() => setOpenPostman(false)}
          open={openPostman}
          app={app}
        />
      )}
      <QRCodeDialog
        title={'QR Code'}
        open={openQRCode.open}
        onClose={() =>
          setOpenQRCode({
            open: false,
            data: '',
          })
        }
        qrCodeValue={openQRCode.data}
      />
      {app && (
        <EditAppDialog
          title="Edit App"
          open={openEditApp}
          onClose={(reload: boolean) => {
            if (reload && appId) {
              fetchApp(appId);
            }
            setOpenEditApp(false);
          }}
          app={app}
        />
      )}
      {app && (
        <GitLabCIDialog
          title={'GitLab CI'}
          onClose={() => setOpenGitLab(false)}
          open={openGitLab}
          app={app}
        />
      )}
      {app && (
        <UploadAppVersionDialog
          title={'Upload New Version'}
          onClose={(reload: boolean) => {
            if (reload && appId) {
              fetchAppVersionTags(appId);
              fetchAppVersion(appId);
            }
            setOpenUploadVersion(false);
          }}
          open={openUploadVersion}
          app={app}
        />
      )}
    </div>
  );
};

export default ViewApp;
