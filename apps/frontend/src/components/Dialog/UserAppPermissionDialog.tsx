import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Typography,
} from '@material-tailwind/react';
import { App } from '../../app/util/type/App';
import UserAppPermissionsTable, {
  UserAppPermissionsTableRef,
} from '../Table/UserAppPermissionsTable';
import { useRef } from 'react';
import { isEqual } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import TextInput from '../Input/Input';
import API from '../../app/util/api';
import { useAppStore } from '../../app/util/store/store';
import { RoleType } from '../../app/util/type/RoleType';
import { PortalUserProfile } from '../../app/util/type/PortalUserProfile';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  app: App;
};

const UserAppPermissionDialog = ({ title, onClose, open, app }: Props) => {
  const { t } = useTranslation(['app']);
  const [selectedTenant] = useAppStore((state) => [state.selectedTenant]);
  const tableRef = useRef<UserAppPermissionsTableRef>(null);
  const searchForm = useForm<{
    email: string;
  }>({});

  const searchUser = async (values: { email: string }) => {
    if (!selectedTenant) {
      return;
    }
    try {
      const res = await API.user.searchUsers(selectedTenant.id, {
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
        searchForm.setError('email', {
          message: 'No user found!',
        });
        return;
      }
      const validUser = items.find(
        (u) => !u.roles.map((r) => r.type).includes(RoleType.ADMIN)
      );
      if (validUser) {
        tableRef?.current?.addUser(validUser);
      } else {
        searchForm.setError('email', {
          message: 'This user is Admin!',
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
            appId: app.id,
            permissions: permissionKeys.filter(
              (p) => userPermissions[userId][p] === true
            ),
          });
        }
        toast.success(t('Updated successfully'));
      }

      onClose();
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    } finally {
      searchForm.reset({ email: '' });
    }
  };
  return (
    <Dialog
      open={open}
      handler={() => {
        onClose();
        searchForm.reset({ email: '' });
      }}
      className="!max-w-[50%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>
        <div className="flex flex-col mx-auto my-2">
          <Typography className="mb-2 font-bold">Add User</Typography>
          <form
            autoFocus={false}
            onSubmit={searchForm.handleSubmit(searchUser)}
          >
            {/* Search */}
            <Controller
              name="email"
              control={searchForm.control}
              rules={{
                required: 'Email is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label="Search by email"
                    type="email"
                    error={error}
                    disabled={searchForm.formState.isSubmitting}
                    autoFocus={false}
                  />
                );
              }}
            />
          </form>
          <form>
            {/* Checkbox */}
            {/* Save */}
          </form>
        </div>
        <div className="border-b border-black/10 w-full h-[1px]"></div>
        <div className="flex flex-col mx-auto my-2">
          <Typography className="mb-2 font-bold">
            Users with permissions
          </Typography>
          <UserAppPermissionsTable
            ref={tableRef}
            app={app}
            page={1}
            enableFooter={false}
            supperSearch=""
          />
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          onClick={() => {
            save();
          }}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default UserAppPermissionDialog;
