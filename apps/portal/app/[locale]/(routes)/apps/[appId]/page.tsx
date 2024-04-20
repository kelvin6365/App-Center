'use client';
import useDialogState from '@/app/[locale]/(routes)/apps/[appId]/_helper/useDialogState';
import Custom404 from '@/components/404';
import CustomBreadcrumb from '@/components/breadcrumb/breadcrumb';
import PageTitle from '@/components/content/pageTitle';
import EditAppDialog from '@/components/dialog/editAppDialog';
import EditAppUserPermissionDialog from '@/components/dialog/editAppUserPermissionDialog';
import GitLabCICodeDialog from '@/components/dialog/gitlabCICodeDialog';
import JiraDialog from '@/components/dialog/jiraDialog';
import PostmanDialog from '@/components/dialog/postmanDialog';
import QRCodeDialog from '@/components/dialog/qrCodeDialog';
import ShareDialog from '@/components/dialog/shareDialog';
import UploadVersionDialog from '@/components/dialog/uploadVersionDialog';
import AppVersionTable, { TableRef } from '@/components/table/appVersionTable';
import useAppQuery from '@/queries/useAppQuery';
import useUserProfileQuery from '@/queries/useUserProfileQuery';
import API from '@/services/api';
import PermissionEnum from '@/types/Permission';
import { maskingString } from '@/utils';
import {
  checkAllowAppActionPermission,
  checkAllowModifyAppUserPermission,
} from '@/utils/permissionChecking';
import { Button, Skeleton } from '@app-center/shadcn/ui';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@app-center/shadcn/ui/lib/ui/tooltip';
import { Spinner } from '@material-tailwind/react';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BiEdit, BiLogoGitlab, BiLogoPlayStore } from 'react-icons/bi';
import { BsGit } from 'react-icons/bs';
import { FaCloudUploadAlt, FaKey } from 'react-icons/fa';
import { GrAppleAppStore } from 'react-icons/gr';
import { IoIosCopy } from 'react-icons/io';
import { MdGroupAdd } from 'react-icons/md';
import { SiConfluence, SiJirasoftware, SiPostman } from 'react-icons/si';
import { TiTick } from 'react-icons/ti';
import * as z from 'zod';

const paramsSchema = z.object({
  appId: z.string().uuid(),
});

const AppPage = ({ params }: { params: { appId: string } }) => {
  const isAppIdValid = paramsSchema.safeParse({ appId: params.appId }).success;
  const t = useTranslations('Apps');
  const router = useRouter();

  //Fetch App data
  const { app, isLoading, isError, error, refetch } = useAppQuery({
    appId: params.appId,
    ready: isAppIdValid,
  });
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    refetch: refetchUserProfile,
  } = useUserProfileQuery();
  const [copied, setCopied] = useState(false);
  const [keyLoading, setKeyLoading] = useState(false);

  //[Open Models]---[Start]
  const {
    openPostman,
    setOpenPostman,
    openQRCode,
    setOpenQRCode,
    openGitLab,
    setOpenGitLab,
    openEditApp,
    setOpenEditApp,
    openUploadVersion,
    setOpenUploadVersion,
    openShareInstallURL,
    setOpenShareInstallURL,
    openJira,
    setOpenJira,
    openJiraIssues,
    setOpenJiraIssues,
    openUserAppPermissions,
    setOpenUserAppPermissions,
  } = useDialogState();
  //[Open Models]----[End]

  const tableRef = useRef<TableRef>(null);

  //get API Key
  const getAPIKey = async () => {
    if (!app) {
      return;
    }
    try {
      setKeyLoading(true);
      const res = await API.app.getAPIKey(app.id);
      const { data } = res.data;
      setCopied(true);
      setKeyLoading(false);
      navigator.clipboard.writeText(data ?? '');
      toast.success(t('Messages.API Key Copied'));
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (error) {
      setKeyLoading(false);
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  if (isAppIdValid === false || isError) {
    return (
      <div>
        <CustomBreadcrumb
          items={[
            {
              label: t('Apps'),
              href: '/apps',
            },
            {
              label: t('All Apps'),
              href: '/apps/all',
            },
            {
              label: `${'-'}`,
              href: `/apps/${params.appId}`,
            },
          ]}
        />
        <div className="py-4">
          <Custom404
            title={t('Invalid App ID')}
            description={t('Invalid App ID description')}
            backBtnText={t('Back to All Apps')}
            backBtnOnClick={() => {
              router.push('/apps/all');
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t('Apps'),
            href: '/apps',
          },
          {
            label: t('All Apps'),
            href: '/apps/all',
          },
          {
            label: `${app?.name ?? ''}`,
            href: `/apps/${params.appId}`,
          },
        ]}
      />
      <PageTitle
        isLoading={isLoading}
        title={app?.name ?? ''}
        description={app?.description ?? ''}
      />
      <div className="flex flex-wrap py-4 md:flex-nowrap sm:space-x-6">
        <div className="w-[180px] m-auto md:m-0">
          {app ? (
            <Image
              className="max-w-full rounded-lg border min-w-[180px] w-[180px] h-[170px] sm:h-[180px] mb-2"
              src={app?.iconFileURL}
              alt={app?.name}
              width={180}
              height={170}
              // placeholder={
              //   <div className="max-w-full rounded-lg border w-[180px] h-[170px] sm:h-[180px] animate-pulse bg-blue-gray-200/30"></div>
              // }
            />
          ) : (
            <div className="max-w-full rounded-lg border w-[180px] h-[170px] sm:h-[180px] animate-pulse bg-blue-gray-200/30 mb-2"></div>
          )}
          {!isLoading ? (
            <div className="flex py-2">
              <span
                className="inline-flex text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 cursor-pointer rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600"
                onClick={() => {
                  if (!copied) {
                    getAPIKey();
                  }
                }}
              >
                {!copied ? (
                  <div className="relative flex">
                    <FaKey className="m-auto mx-3" />
                    {keyLoading && (
                      <div className="absolute top-0 bottom-0 left-0 right-0 flex bg-blue-gray-400/50">
                        <Spinner className="w-5 h-5 m-auto" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="m-auto">
                    <TooltipProvider>
                      <Tooltip defaultOpen>
                        <TooltipTrigger asChild>
                          <div className="relative">
                            <IoIosCopy className="mx-3" />
                            <TiTick className="absolute right-[0px] bottom-[-8px] text-green-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{t('Copied')}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
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
          ) : (
            <Skeleton className="h-[42px] my-4" />
          )}
          {!isLoading && (
            <div className="my-2 border border-gray-200 rounded bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
              <p className="px-4 pt-4 font-normal text-blue-gray-400">
                {t('Quick Access')}
              </p>
              <TooltipProvider>
                <div className="grid grid-cols-3 gap-2 p-4">
                  {/* Apple Store */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] bg-white text-cyan-500"
                    onClick={() => {
                      if (app?.extra?.appStoreURL) {
                        window.open(app.extra.appStoreURL, '_blank');
                      } else {
                        toast.error(t('App Store URL is not set'));
                      }
                    }}
                  >
                    <GrAppleAppStore className="w-5 h-5 m-auto" />
                  </Button>

                  {/* Play Store */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] bg-white text-cyan-500"
                    onClick={() => {
                      if (app?.extra?.playStoreURL) {
                        window.open(app.extra.playStoreURL, '_blank');
                      } else {
                        toast.error(t('Play Store URL is not set'));
                      }
                    }}
                  >
                    <BiLogoPlayStore className="w-5 h-5" />
                  </Button>

                  {/* Project Git */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] text-orange-500 bg-white"
                    onClick={() => {
                      if (app?.extra?.repoURL) {
                        window.open(app.extra.repoURL, '_blank');
                      } else {
                        toast.error(t('Git Repository URL is not set'));
                      }
                    }}
                  >
                    <BsGit className="w-5 h-5" />
                  </Button>

                  {/* Postman */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-[40px] h-[40px] text-orange-500 bg-white"
                        onClick={() => {
                          setOpenPostman(true);
                        }}
                      >
                        <SiPostman className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('Postman')}</TooltipContent>
                  </Tooltip>
                  {/* GitLab CI */}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-[40px] h-[40px] text-orange-500 bg-white"
                        onClick={() => {
                          setOpenGitLab(true);
                        }}
                      >
                        <BiLogoGitlab className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{t('GitLab CI')}</TooltipContent>
                  </Tooltip>

                  {/* Jira */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] text-blue-500 bg-white"
                    onClick={() => {
                      setOpenJira(true);
                    }}
                  >
                    <SiJirasoftware className="w-5 h-5" />
                  </Button>

                  {/* Confluence */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] text-blue-500 bg-white"
                    onClick={() => {
                      if (app?.extra?.confluenceURL) {
                        window.open(app.extra.confluenceURL, '_blank');
                      } else {
                        toast.error(t('Confluence URL is not set'));
                      }
                    }}
                  >
                    <SiConfluence className="w-5 h-5" />
                  </Button>

                  {/* Upload New Version */}
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-[40px] h-[40px] text-gray-500 bg-white"
                    onClick={() => {
                      setOpenUploadVersion(true);
                    }}
                  >
                    <FaCloudUploadAlt className="w-5 h-5" />
                  </Button>

                  {/* Edit App */}
                  {!isLoadingUserProfile &&
                    !isErrorUserProfile &&
                    userProfile &&
                    checkAllowAppActionPermission(userProfile, [
                      PermissionEnum.EDIT_APP,
                    ]) && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-[40px] h-[40px] text-gray-500 bg-white"
                        onClick={() => {
                          setOpenEditApp(true);
                        }}
                      >
                        <BiEdit className="w-5 h-5" />
                      </Button>
                    )}

                  {!isLoadingUserProfile &&
                    !isErrorUserProfile &&
                    checkAllowModifyAppUserPermission(
                      userProfile?.roles ?? []
                    ) && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-gray-500 bg-white"
                        onClick={() => {
                          setOpenUserAppPermissions(true);
                        }}
                      >
                        <MdGroupAdd className="w-5 h-5" />
                      </Button>
                    )}
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
        <div className="w-full p-1">
          {app && (
            <AppVersionTable
              ref={tableRef}
              appId={app.id}
              setOpenQRCode={setOpenQRCode}
              setOpenShareInstallURL={setOpenShareInstallURL}
              setOpenJiraIssues={setOpenJiraIssues}
            />
          )}
        </div>
      </div>
      <QRCodeDialog
        title={t('QR Code')}
        description={t('Scan this QR code to install this app')}
        open={openQRCode.open}
        onClose={() =>
          setOpenQRCode({
            open: false,
            data: '',
          })
        }
        qrCodeValue={openQRCode.data}
      />
      <ShareDialog
        title={t('Share link')}
        description={t('Anyone who has this link will be able to view this')}
        onClose={() =>
          setOpenShareInstallURL({
            open: false,
            data: null,
          })
        }
        open={openShareInstallURL.open}
        data={openShareInstallURL.data}
      />
      <PostmanDialog
        title={t('Postman')}
        description={t('Generate cURL script for importing into Postman')}
        onClose={() => setOpenPostman(false)}
        open={openPostman}
        app={app}
      />
      <GitLabCICodeDialog
        title={t('GitLab CI')}
        description={t('Generate cURL script for importing into GitLab CI')}
        onClose={() => setOpenGitLab(false)}
        open={openGitLab}
        app={app}
      />
      <JiraDialog
        open={openJira}
        title={t('Jira Integration')}
        description={t('Allow you to connect to Jira')}
        onClose={(reload: boolean) => {
          if (reload && app?.id) {
            refetch();
            tableRef.current?.reload();
          }
          setOpenJira(false);
        }}
        app={app}
      />
      <UploadVersionDialog
        title={t('Upload New Version')}
        description={t('Upload a new version of this app')}
        onClose={(reload: boolean) => {
          if (reload && app?.id) {
            refetch();
            tableRef.current?.reload();
          }
          setOpenUploadVersion(false);
        }}
        open={openUploadVersion}
        app={app}
      />
      <EditAppDialog
        title={t('Edit App')}
        description={t('Edit this app')}
        open={openEditApp}
        onClose={(reload: boolean) => {
          if (reload && app?.id) {
            refetch();
          }
          setOpenEditApp(false);
        }}
        app={app}
      />
      <EditAppUserPermissionDialog
        title={t('Users App Permissions')}
        description={t('Allows you to assign users to this app')}
        onClose={() => {
          setOpenUserAppPermissions(false);
        }}
        open={openUserAppPermissions}
        app={app}
      />
    </div>
  );
};

export default AppPage;
