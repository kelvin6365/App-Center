import { Button, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import FileUpload from '../../../components/Input/FileUpload';
import API from '../../util/api';
import { useNavigate } from 'react-router-dom';
import TextInput from '../../../components/Input/Input';
import { useAppStore } from '../../util/store/store';

type CreateAppFormInputs = {
  name: string;
  description: string;
  icon: FileList;
  playStoreURL: string;
  appStoreURL: string;
  repoURL: string;
  jiraURL: string;
  confluenceURL: string;
};

const CreateApp = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      name: undefined,
      description: undefined,
      icon: undefined,
    },
  });
  const navigate = useNavigate();
  const [selectedTenant] = useAppStore((state) => [state.selectedTenant]);

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit: SubmitHandler<CreateAppFormInputs> = async (values) => {
    if (!selectedTenant) {
      return;
    }
    try {
      const res = await API.app.createApp({
        name: values.name,
        description: values.description,
        icon: values.icon[0] ?? null,
        tenantId: selectedTenant?.id,
        extra: {
          playStoreURL: values.playStoreURL,
          appStoreURL: values.appStoreURL,
          repoURL: values.repoURL,
          jiraURL: values.jiraURL,
          confluenceURL: values.confluenceURL,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, status }: { data: any; status: any } = res.data;
      if (status.code === 1000) {
        reset();
        toast.success('Video created successfully');
        watch();
        navigate('/apps/' + data);
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
  return (
    <div>
      <DefaultBreadcrumb pageName="Dashboard.Create App" paths={['/apps']} />
      <div className="pb-2">
        <Typography variant="h4" color="blue-gray">
          Create New App
        </Typography>
        <Typography color="gray" className="mt-1 font-normal">
          Enter the details to create a new app.
        </Typography>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-sm mt-8 mb-2"
      >
        <div className="flex flex-col gap-6 mb-4">
          <div>
            <TextInput
              label={'Tenant'}
              value={selectedTenant?.name}
              disabled={true}
              helperText="This app will be created for this tenant"
            />
          </div>

          <Controller
            name="name"
            control={control}
            rules={{
              required: 'App Name is required',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="App Name*"
                  error={error}
                  disabled={isSubmitting}
                />
              );
            }}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: 'App Description is required',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="Description*"
                  error={error}
                  disabled={isSubmitting}
                />
              );
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Controller
            name="playStoreURL"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="Play Store URL"
                  error={error}
                  disabled={isSubmitting}
                  type="url"
                />
              );
            }}
          />
          <Controller
            name="appStoreURL"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="App Store URL"
                  error={error}
                  disabled={isSubmitting}
                  type="url"
                />
              );
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Controller
            name="repoURL"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="Git Repository URL"
                  error={error}
                  disabled={isSubmitting}
                  type="url"
                />
              );
            }}
          />
          {/* <TextInput
            {...register('jiraURL', {})}
            label="Jira URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
          /> */}
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Controller
            name="jiraURL"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="Jira URL"
                  error={error}
                  disabled={isSubmitting}
                  type="url"
                />
              );
            }}
          />
          <Controller
            name="confluenceURL"
            control={control}
            rules={{}}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  {...field}
                  label="Confluence URL"
                  error={error}
                  disabled={isSubmitting}
                  type="url"
                />
              );
            }}
          />
        </div>
        <FileUpload
          {...register('icon', {
            required: 'App Icon is required',
          })}
          loading={isSubmitting}
          errors={errors}
        />

        <Button
          className="mt-6"
          fullWidth
          type="submit"
          disabled={isSubmitting}
        >
          Create
        </Button>
      </form>
    </div>
  );
};

export default CreateApp;
