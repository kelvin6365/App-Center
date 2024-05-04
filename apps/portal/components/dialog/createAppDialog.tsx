import FileUpload from '@/components/fileUpload/fileUpload';
import Loading from '@/components/loading';
import API from '@/services/api';
import { App } from '@/types/App';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from '@app-center/shadcn/ui';
import { cn } from '@app-center/shadcn/util';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
};
type CreateAppFormInputs = {
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  playStoreURL: string;
  appStoreURL: string;
  repoURL: string;
  jiraURL: string;
  confluenceURL: string;
};

const CreateAppDialog = ({ title, onClose, open, description }: Props) => {
  const t = useTranslations('Apps');

  const form = useForm<CreateAppFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      icon: undefined,
      playStoreURL: '',
      appStoreURL: '',
      repoURL: '',
      jiraURL: '',
      confluenceURL: '',
      name: '',
      description: '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = form;

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
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success(t('Created Successfully'));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      {isSubmitting && (
        <div className="absolute top-0 bottom-0 left-0 right-0 z-[99999] bg-blue-gray-400/20">
          <Loading fullScreen />
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={() => {
          if (!isSubmitting) {
            reset();
            onClose(false);
          }
        }}
      >
        <DialogContent
          className={cn('!max-w-[60%] !w-full max-h-[85%] overflow-scroll')}
          onEscapeKeyDown={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
          onInteractOutside={(e) => {
            if (isSubmitting) {
              e.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="edit-form"
              onSubmit={handleSubmit(onSubmit)}
              className="relative max-w-screen-sm mx-auto mt-8 mb-2"
            >
              <div className="flex flex-col gap-2 mb-4">
                <FormField
                  name="name"
                  control={control}
                  rules={{
                    required: t('App Name is required'),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('App Name')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="description"
                  control={control}
                  rules={{
                    required: t('Description is required'),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Description')}
                        </FormLabel>
                        <Textarea {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('This is the description of the app')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormField
                  name="playStoreURL"
                  control={control}
                  rules={{}}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Play Store URL')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('eg')}:{' '}
                          {
                            'https://play.google.com/store/apps/details?id=<package_name>'
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="appStoreURL"
                  control={control}
                  rules={{}}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>{t('App Store URL')}</FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('eg')}:{' '}
                          {
                            'https://apps.apple.com/<country>/app/<app–name>/id<app-ID>'
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormField
                  name="repoURL"
                  control={control}
                  rules={{}}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Git Repository URL')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('eg')}: {'https://gitlab.com/username/project'}
                        </FormDescription>
                        <FormMessage />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <FormField
                  name="jiraURL"
                  control={control}
                  rules={{}}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Jira URL')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('eg')}:{' '}
                          {
                            'https://<COMPANY>.atlassian.net/jira/software/c/project/<Project code>/board/<ID>'
                          }
                        </FormDescription>
                        <FormMessage />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="confluenceURL"
                  control={control}
                  rules={{}}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Confluence URL')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />
                        <FormDescription className="break-words">
                          {t('eg')}:{' '}
                          {
                            'https://<COMPANY>.atlassian.net/wiki/spaces/<Project code>'
                          }
                        </FormDescription>
                        <FormMessage />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FileUpload
                {...register('icon', {})}
                loading={isSubmitting}
                errors={errors}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!isSubmitting) {
                  form.handleSubmit(onSubmit)();
                }
              }}
            >
              <span>{t('Done')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateAppDialog;
