import { Button, Typography } from '@material-tailwind/react';
import axios from 'axios';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import DefaultBreadcrumb from '../../../components/Breadcrumb/DefaultBreadcrumb';
import FileUpload from '../../../components/Input/FileUpload';
import TextInput from '../../../components/Input/TextInput';
import API from '../../util/api';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    reset();
  }, [reset]);

  const onSubmit: SubmitHandler<CreateAppFormInputs> = async (values) => {
    console.log(values);
    try {
      const res = await API.app.createApp({
        name: values.name,
        description: values.description,
        icon: values.icon[0] ?? null,
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
      <DefaultBreadcrumb pageName="Dashboard.Create App" paths={['/']} />
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
          <TextInput
            {...register('name', {
              required: 'App Name is required',
            })}
            label="App Name*"
            errors={errors}
            loading={isSubmitting}
          />
          <TextInput
            {...register('description', {
              required: 'App Description is required',
            })}
            label="Description*"
            errors={errors}
            loading={isSubmitting}
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <TextInput
            {...register('playStoreURL', {})}
            label="Play Store URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
          />
          <TextInput
            {...register('appStoreURL', {})}
            label="App Store URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
          />
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <TextInput
            {...register('repoURL', {})}
            label="Git Repository URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
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
          <TextInput
            {...register('jiraURL', {})}
            label="Jira URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
          />
          <TextInput
            {...register('confluenceURL', {})}
            label="Confluence URL"
            errors={errors}
            loading={isSubmitting}
            type="url"
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
