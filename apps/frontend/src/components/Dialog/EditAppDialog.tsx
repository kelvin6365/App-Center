import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import axios from 'axios';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../../app/util/api';
import { App } from '../../app/util/type/App';
import FileUpload from '../Input/FileUpload';
import TextInput from '../Input/TextInput';
import { useEffect } from 'react';

type Props = {
  title: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App;
};
type EditAppFormInputs = {
  name: string;
  description: string;
  icon: any;
  playStoreURL: string;
  appStoreURL: string;
  repoURL: string;
  jiraURL: string;
  confluenceURL: string;
};

const EditAppDialog = ({ title, onClose, open, app }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EditAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      name: app.name,
      description: app.description,
      playStoreURL: app.extra?.playStoreURL,
      appStoreURL: app.extra?.appStoreURL,
      repoURL: app.extra?.repoURL,
      jiraURL: app.extra?.jiraURL,
      confluenceURL: app.extra?.confluenceURL,
      icon: undefined,
    },
  });

  const onSubmit: SubmitHandler<EditAppFormInputs> = async (values) => {
    try {
      const res = await API.app.updateApp(app.id, {
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
      const { status }: { data: any; status: any } = res.data;
      console.log(status);
      if (status.code === 1000) {
        onClose(true);
        toast.success('Update successfully');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    reset({
      name: app.name,
      description: app.description,
      playStoreURL: app.extra?.playStoreURL,
      appStoreURL: app.extra?.appStoreURL,
      repoURL: app.extra?.repoURL,
      jiraURL: app.extra?.jiraURL,
      confluenceURL: app.extra?.confluenceURL,
      icon: undefined,
    });
  }, [app, reset]);

  return (
    <Dialog
      open={open}
      handler={() => {
        if (!isSubmitting) {
          reset();
          onClose(false);
        }
      }}
      className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider className="">
        <form
          id="edit-form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-screen-sm mx-auto mt-8 mb-2"
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
          {app.iconFileURL && (
            <div className="pointer-events-none relative mx-auto my-2 flex w-[180px]">
              <img src={app.iconFileURL} alt="preview" className="mx-auto" />
            </div>
          )}
          <FileUpload
            {...register('icon', {})}
            loading={isSubmitting}
            errors={errors}
          />
        </form>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          type="submit"
          form="edit-form"
          disabled={isSubmitting}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditAppDialog;
