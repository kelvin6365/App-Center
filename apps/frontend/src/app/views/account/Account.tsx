import { MainButton, OutlinedButton } from '@app-center/shared-ui';
import { Card, CardBody, Tooltip, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { BsExclamationCircle } from 'react-icons/bs';
import { RiProfileLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import TextInput from '../../../components/Input/Input';
import API from '../../util/api';
import { useAppStore } from '../../util/store/store';

type GeneralProfileInput = {
  email: string;
  name: string;
};
type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};
const Account = () => {
  const { t } = useTranslation(['app']);
  const [profile, setProfile] = useAppStore((state) => [
    state.profile,
    state.setProfile,
  ]);

  const {
    handleSubmit: generalHandleSubmit,
    control: generalControl,
    reset: generalReset,
    formState: { isSubmitting: generalIsSubmitting, isDirty: generalIsDirty },
  } = useForm<GeneralProfileInput>({
    mode: 'onChange',
    defaultValues: {
      email: profile?.profile?.email,
      name: profile?.profile.name,
    },
  });

  const {
    handleSubmit: changePasswordHandleSubmit,
    control: changePasswordControl,
    reset: changePasswordReset,
    watch: changePasswordWatch,
    formState: {
      isSubmitting: changePasswordIsSubmitting,
      isDirty: changePasswordIsDirty,
    },
  } = useForm<ChangePasswordInput>({
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const updateProfile = async (values: GeneralProfileInput) => {
    try {
      const res = await API.user.updateProfile({
        name: values.name,
      });
      const { data } = res.data;
      setProfile(data);
      generalReset({
        name: values.name,
        email: values.email,
      });
      toast.success(t('Updated successfully'));
    } catch (error) {
      console.error(error);
      toast.error(t('Update failed'));
    }
  };

  const changePassword = async (values: ChangePasswordInput) => {
    try {
      await API.user.changePassword({
        oldPassword: values.oldPassword,
        password: values.newPassword,
      });
      changePasswordReset();
      toast.success(t('Updated successfully'));
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(
          t('Update failed') +
            ' ' +
            error.response?.data?.status?.displayMessage
        );
      } else {
        toast.error(t('Update failed'));
      }
    }
  };

  return (
    <div>
      <DefaultBreadcrumb
        pageName="Account"
        icon={<RiProfileLine className="w-5 h-5" />}
        paths={['/account']}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Account Settings
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Configurations for your account.
        </Typography>
      </div>
      {/* <div className="flex items-center gap-4 p-2">
        <Avatar
          alt="avatar"
          src={
            profile?.profile?.avatar ??
            'https://ui-avatars.com/api/?name=' + (profile?.profile?.name ?? '')
          }
          className="border border-blue-500 shadow-xl shadow-blue-900/20 ring-4 ring-blue-500/30"
        />
        <div>
          <Typography
            variant="p"
            className="text-base font-bold"
            color="blue-gray"
          >
            {profile?.profile?.name ?? '-'}
          </Typography>
          <Typography color="gray" variant="p" className="text-xs font-light">
            {profile?.status ?? '-'}
          </Typography>
        </div>
      </div> */}
      <section className="my-4">
        <Card className="border" shadow={false}>
          <CardBody>
            <Typography
              variant="h5"
              color="blue-gray"
              className="relative flex"
            >
              <p className="my-auto">{t('General')}</p>
              <div className="my-auto ml-2">
                <Tooltip content={'ID : ' + profile?.id}>
                  <div>
                    <BsExclamationCircle className="w-5 h-5" />
                  </div>
                </Tooltip>
              </div>
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="flex items-center gap-1 font-normal"
            >
              {t('Basic account information')}
            </Typography>
            <form
              className="flex flex-col gap-6 mt-4"
              onSubmit={generalHandleSubmit(updateProfile)}
              onReset={() => generalReset()}
            >
              <Controller
                name="email"
                control={generalControl}
                rules={{
                  required: t('Email is required.'),
                }}
                render={({ field, formState: { errors } }) => {
                  return (
                    <TextInput
                      {...field}
                      label={t('Email')}
                      error={errors.email}
                      enableErrorText
                      disabled={true}
                    />
                  );
                }}
              />
              <Controller
                name="name"
                control={generalControl}
                rules={{
                  required: t('Account Name is required.'),
                }}
                render={({ field, formState: { errors } }) => {
                  return (
                    <TextInput
                      {...field}
                      label={t('Account Name')}
                      error={errors.name}
                      enableErrorText
                      disabled={generalIsSubmitting}
                    />
                  );
                }}
              />
              <div className="flex gap-4">
                <MainButton
                  type="submit"
                  disabled={!generalIsDirty || generalIsSubmitting}
                >
                  {t('Save')}
                </MainButton>
                <OutlinedButton
                  type="reset"
                  disabled={!generalIsDirty || generalIsSubmitting}
                >
                  {t('Reset')}
                </OutlinedButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </section>
      <section className="my-4">
        <Card className="border" shadow={false}>
          <CardBody>
            <Typography
              variant="h5"
              color="blue-gray"
              className="relative flex"
            >
              <p className="my-auto">{t('Change Password')}</p>
              <div className="my-auto ml-2">
                <Tooltip
                  content={
                    <>
                      {t('Change your Password here.')}
                      <br />
                      {t('Please record your new password after the change!')}
                    </>
                  }
                >
                  <div>
                    <BsExclamationCircle className="w-5 h-5" />
                  </div>
                </Tooltip>
              </div>
            </Typography>
            <Typography
              variant="small"
              color="gray"
              className="flex items-center gap-1 font-normal"
            >
              {t('Change your Password')}
            </Typography>
            <form
              className="flex flex-col gap-6 mt-4"
              onSubmit={changePasswordHandleSubmit(changePassword)}
              onReset={() => changePasswordReset()}
            >
              <Controller
                name="oldPassword"
                control={changePasswordControl}
                rules={{
                  required: t('Old Password is required.'),
                }}
                render={({ field, formState: { errors } }) => {
                  return (
                    <TextInput
                      {...field}
                      label={t('Old Password')}
                      error={errors.oldPassword}
                      enableErrorText
                      disabled={changePasswordIsSubmitting}
                      type="password"
                    />
                  );
                }}
              />
              <Controller
                name="newPassword"
                control={changePasswordControl}
                rules={{
                  required: t('New Password is required.'),
                  //old password should not same as new password
                  validate: (value) =>
                    value !== changePasswordWatch('oldPassword') ||
                    t('New Password should not same as Old Password'),
                }}
                render={({ field, formState: { errors } }) => {
                  return (
                    <TextInput
                      {...field}
                      label={t('New Password')}
                      error={errors.newPassword}
                      enableErrorText
                      disabled={changePasswordIsSubmitting}
                      type="password"
                    />
                  );
                }}
              />
              <Controller
                name="confirmPassword"
                control={changePasswordControl}
                rules={{
                  required: t('Confirm Password is required.'),
                  //Validation matching with password
                  validate: {
                    matchPassword: (value) => {
                      if (value !== changePasswordWatch('newPassword')) {
                        return t('Passwords do not match.');
                      }
                    },
                  },
                }}
                render={({ field, formState: { errors } }) => {
                  return (
                    <TextInput
                      {...field}
                      label={t('Confirm Password')}
                      error={errors.confirmPassword}
                      enableErrorText
                      disabled={changePasswordIsSubmitting}
                      type="password"
                    />
                  );
                }}
              />
              <div className="flex gap-4">
                <MainButton
                  type="submit"
                  disabled={
                    !changePasswordIsDirty || changePasswordIsSubmitting
                  }
                >
                  {t('Save')}
                </MainButton>
                <OutlinedButton
                  type="reset"
                  disabled={
                    !changePasswordIsDirty || changePasswordIsSubmitting
                  }
                >
                  {t('Reset')}
                </OutlinedButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </section>
    </div>
  );
};

export default Account;
