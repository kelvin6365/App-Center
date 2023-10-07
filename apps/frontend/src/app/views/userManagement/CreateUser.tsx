import {
  Alert,
  Button,
  Option,
  Select,
  Typography,
} from '@material-tailwind/react';
import axios from 'axios';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import TextInput from '../../../components/Input/Input';
import API from '../../util/api';
import { useAppStore } from '../../util/store/store';
import { RoleType } from '../../util/type/RoleType';
type CreateUser = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RoleType;
};
const CreateUser = () => {
  const [profile, selectedTenant] = useAppStore((state) => [
    state.profile,
    state.selectedTenant,
  ]);
  const [createdUser, setCreatedUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const {
    reset,
    handleSubmit,
    watch,
    control,
    formState: { isSubmitting },
  } = useForm<CreateUser>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: undefined,
    },
  });

  const onSubmit = async (values: CreateUser) => {
    if (!profile || !selectedTenant) {
      return;
    }
    if (createdUser) {
      setCreatedUser(null);
    }
    try {
      const res = await API.user.createUser({
        name: values.name,
        email: values.email,
        username: values.email,
        password: values.password,
        roleTypes: [values.role],
        permissions: [],
        tenantIds: [selectedTenant.id],
      });
      const { status } = res.data;
      if (status.code === 1000) {
        toast.success('Create user successfully');
        setCreatedUser({
          email: values.email,
          name: values.name,
        });
        reset({});
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      } else {
        toast.error(error?.toString());
      }
    }
  };

  return (
    <div>
      <DefaultBreadcrumb
        pageName={'User Management.Create User'}
        paths={['/users']}
      />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Create User
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Create a new user.
        </Typography>
      </div>
      <div className="max-w-screen-sm mt-8 mb-2">
        <Alert
          open={createdUser ? true : false}
          color="green"
          className="max-w-screen-md my-4 rounded-none border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
          onClose={() => setCreatedUser(null)}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                clipRule="evenodd"
              />
            </svg>
          }
        >
          <Typography variant="h5" color="#2ec946">
            New User Created
          </Typography>
          <Typography color="#2ec946" className="mt-2 font-normal">
            <div className="grid grid-cols-2">
              <div>Name:</div> <div>{createdUser?.name}</div>
              <div>Email:</div> <div>{createdUser?.email}</div>
            </div>
          </Typography>
        </Alert>
        <form
          className="space-y-4 md:space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <TextInput
              label={'Tenant'}
              value={selectedTenant?.name}
              disabled={true}
              helperText="This user will be assign in this tenant"
            />
          </div>
          <div>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label={'Email'}
                    disabled={isSubmitting}
                    type="email"
                    error={error}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="role"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    ref={field.ref}
                    color="blue"
                    label="Role"
                    disabled={isSubmitting}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  >
                    <Option value={RoleType.ADMIN}>{'Admin'}</Option>
                    <Option value={RoleType.USER}>{'User'}</Option>
                  </Select>
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label={'Password'}
                    disabled={isSubmitting}
                    type="password"
                    error={error}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="confirmPassword"
              control={control}
              rules={{
                required: 'Confirm Password is required',
                validate: (value) => {
                  return value === watch('password')
                    ? true
                    : 'Passwords do not match';
                },
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label={'Confirm Password'}
                    disabled={isSubmitting}
                    type="password"
                    error={error}
                  />
                );
              }}
            />
          </div>
          <div>
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Name is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label={'Name'}
                    disabled={isSubmitting}
                    error={error}
                  />
                );
              }}
            />
          </div>
          <Button disabled={isSubmitting} className="w-full" type="submit">
            Create
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
