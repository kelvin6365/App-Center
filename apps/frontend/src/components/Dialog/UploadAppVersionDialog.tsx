import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import axios from 'axios';
import { useEffect } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../../app/util/api';
import { App } from '../../app/util/type/App';
import FileUpload from '../Input/FileUpload';
import TextInput from '../Input/Input';
import Loading from '../Loading/Loading';

type Props = {
  title: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  app: App;
};
type EditAppFormInputs = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
  tags: string;
  installPassword: string;
};

const UploadAppVersionDialog = ({ title, onClose, open, app }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<EditAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit: SubmitHandler<EditAppFormInputs> = async (values) => {
    try {
      const apiKeyResult = await API.app.getAPIKey(app.id);
      const { data: apiKey } = apiKeyResult.data;
      const res = await API.app.uploadAppVersion(app.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        file: values.file[0] ?? null,
        apiKey: apiKey,
        tags: values.tags
          .split(',')
          .map((tag) => tag.trim())
          .join(','),
        installPassword: values.installPassword.trim(),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { status }: { data: any; status: any } = res.data;
      console.log(status);
      if (status.code === 1000) {
        onClose(true);
        reset();
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
    reset();
  }, [reset]);

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
          {isSubmitting && (
            <div className="absolute top-0 bottom-0 left-0 right-0 z-10 bg-blue-gray-400/20">
              <Loading />
            </div>
          )}
          <div className="flex flex-col gap-6 mb-4">
            <Controller
              name="name"
              control={control}
              rules={{
                required: 'Version Name is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label="Version Name*"
                    helperText={'eg: v1.0.0'}
                    error={error}
                    disabled={isSubmitting}
                  />
                );
              }}
            />
            <div>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: 'Version Description is required',
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextInput
                      {...field}
                      label="Description*"
                      helperText={"eg: 'Version 1.0.0'"}
                      error={error}
                      disabled={isSubmitting}
                    />
                  );
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <Controller
                name="tags"
                control={control}
                rules={{
                  required: 'Tags is required',
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextInput
                      {...field}
                      label="Tags*"
                      error={error}
                      disabled={isSubmitting}
                      helperText={'eg: Android,UAT,APK'}
                    />
                  );
                }}
              />
            </div>
            <Controller
              name="installPassword"
              control={control}
              rules={{
                required: 'Install Password is required',
              }}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextInput
                    {...field}
                    label="Install Password*"
                    error={error}
                    disabled={isSubmitting}
                    helperText={'For install page to download the app'}
                  />
                );
              }}
            />
          </div>
          <FileUpload
            {...register('file', {
              required: 'File is required',
            })}
            loading={isSubmitting}
            errors={errors}
            accept=".ipa,.apk,application/iphone-package-archive,application/vnd.android.package-archive"
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

export default UploadAppVersionDialog;
