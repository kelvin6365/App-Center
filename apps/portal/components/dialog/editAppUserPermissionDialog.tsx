import Loading from '@/components/loading';
import UserAppPermissionsTable, {
  UserAppPermissionsTableRef,
} from '@/components/table/userAppPermissionsTable';
import API from '@/services/api';
import useTeamSelectionStore from '@/stores/useTeamSelectionStore';
import { App } from '@/types/App';
import { PortalUserProfile } from '@/types/PortalUserProfile';
import { RoleType } from '@/types/RoleType';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
} from '@app-center/shadcn/ui';
import { cn } from '@app-center/shadcn/util';
import { ReloadIcon } from '@radix-ui/react-icons';
import axios from 'axios';
import { isEqual } from 'lodash';
import { UserSearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  title: string;
  description: string;
  onClose: () => void;
  open: boolean;
  app: App | null;
};
const EditAppUserPermissionDialog = ({
  title,
  onClose,
  open,
  app,
  description,
}: Props) => {
  const t = useTranslations('Apps');
  const { selectedTeam } = useTeamSelectionStore();
  const tableRef = useRef<UserAppPermissionsTableRef>(null);
  const searchForm = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: '',
    },
  });
  const {
    register: searchRegister,
    handleSubmit: searchHandleSubmit,
    reset: searchReset,
    setError: searchSetError,
    control: searchControl,
    formState: { errors, isSubmitting: searchIsSubmitting },
  } = searchForm;

  const [savingPermissions, setSavingPermissions] = useState(false);

  const searchUser = async (values: { email: string }) => {
    if (!selectedTeam) {
      return;
    }
    try {
      const res = await API.user.searchUsers(selectedTeam.id, {
        page: 1,
        limit: 1,
        query: JSON.stringify({
          query: values.email,
        }),
      });
      const {
        data: { items },
      }: {
        data: { items: PortalUserProfile[] };
      } = res.data;
      if (items.length === 0) {
        searchSetError('email', {
          message: t('No user found'),
        });
        return;
      }
      const validUser = items.find(
        (u) =>
          !u.roles
            .filter((r) => r.tenantId === selectedTeam.id)
            .map((r) => r.type)
            .includes(RoleType.ADMIN)
      );
      if (validUser) {
        tableRef?.current?.addUser(validUser);
      } else {
        searchSetError('email', {
          message: t('This user is Admin'),
        });
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const save = async () => {
    if (savingPermissions) {
      return;
    }
    setSavingPermissions(true);
    try {
      const { oldUserPermissions, userPermissions } =
        tableRef?.current?.getState() ?? {};
      // isEqual;
      const keys = Object.keys(userPermissions);
      let request = {};
      for (let u = 0; u < keys.length; u++) {
        const userP = userPermissions[keys[u]];
        const oldUser = oldUserPermissions[keys[u]];
        if (!isEqual(userP, oldUser)) {
          request = { ...request, [keys[u]]: userP };
        }
      }
      const requestKeys = Object.keys(request);
      if (requestKeys.length === 0) {
        console.log('[App permissions] nothing to save');
      } else {
        console.log('[App Permissions]', request);
        for (let uk = 0; uk < requestKeys.length; uk++) {
          const userId = requestKeys[uk];
          const permissionKeys = Object.keys(userPermissions[userId]);
          await API.user.addAppPermissions({
            userId: requestKeys[uk],
            appId: app!.id,
            permissions: permissionKeys.filter(
              (p) => userPermissions[userId][p] === true
            ),
          });
        }
        toast.success(t('Updated Successfully'));
      }

      onClose();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    } finally {
      searchForm.reset({ email: '' });
      setSavingPermissions(false);
    }
  };

  return (
    <>
      {savingPermissions && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-[99999] bg-blue-gray-400/20">
          <Loading fullScreen />
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={() => {
          if (!savingPermissions) {
            onClose();
            searchReset({ email: '' });
          }
        }}
      >
        <DialogContent
          className={cn('w-full max-h-[85%] overflow-scroll')}
          onEscapeKeyDown={(e) => {
            if (searchIsSubmitting || savingPermissions) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (searchIsSubmitting || savingPermissions) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Form {...searchForm}>
            <form
              id="edit-form"
              onSubmit={searchHandleSubmit(searchUser)}
              className="relative max-w-screen-sm mx-auto mt-4 mb-2"
            >
              <div className="flex flex-row gap-2 mb-4">
                <FormField
                  name="email"
                  control={searchControl}
                  rules={{
                    required: t('Email is required'),
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: t('Email is invalid'),
                    },
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Search by email')}
                        </FormLabel>
                        <div className="flex gap-4">
                          <Input {...field} disabled={searchIsSubmitting} />
                          <Button
                            className="my-auto"
                            disabled={searchIsSubmitting}
                          >
                            {searchIsSubmitting ? (
                              <>
                                <ReloadIcon className="w-4 h-4 mr-2 animate-spin" />
                                {t('Searching')}
                              </>
                            ) : (
                              <>
                                <UserSearchIcon className="w-4 h-4 mr-2" />
                                {t('Search')}
                              </>
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </form>
          </Form>
          <div className="border-b border-black/10 w-full h-[1px]"></div>
          <div className="flex flex-col mx-auto my-2">
            <Label className="mb-2 font-bold">
              {t('Users with permissions')}
            </Label>
            {app && (
              <UserAppPermissionsTable
                ref={tableRef}
                app={app}
                page={1}
                enableFooter={false}
                supperSearch=""
              />
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!searchIsSubmitting) {
                  save();
                }
              }}
              disabled={savingPermissions}
            >
              <span>{t('Done')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAppUserPermissionDialog;
