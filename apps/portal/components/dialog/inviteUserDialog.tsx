import Loading from '@/components/loading';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app-center/shadcn/ui';
import { cn } from '@app-center/shadcn/util';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { RoleIdType } from '../../types/RoleIdType';
import API from '../../services/api';

type Props = {
  title: string;
  description: string;
  onClose: (reload: boolean) => void;
  open: boolean;
};
type InviteFormInputs = {
  email: string;
  role: string;
};

const InviteUserDialog = ({ title, onClose, open, description }: Props) => {
  const t = useTranslations('Members');

  const form = useForm<InviteFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      email: '',
      role: '',
    },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = form;

  const onSubmit: SubmitHandler<InviteFormInputs> = async (values) => {
    try {
      const res = await API.user.inviteUserToTenant({
        email: values.email,
        role: values.role as RoleIdType,
      });
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        cleanUp();
        toast.success(t('Invite Successfully'));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  const cleanUp = () => {
    reset({
      email: '',
      role: '',
    });
  };

  useEffect(() => {
    return () => {
      cleanUp();
    };
  }, []);

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
            cleanUp();
            onClose(false);
          }
        }}
      >
        <DialogContent
          className={cn('overflow-scroll')}
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
              className="relative mt-8 mb-2"
            >
              <div className="flex flex-col gap-2 mb-4">
                <FormField
                  name="email"
                  control={control}
                  rules={{
                    required: t('Email is required'),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Email')}
                        </FormLabel>
                        <Input {...field} disabled={isSubmitting} />

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  name="role"
                  control={control}
                  rules={{
                    required: t('Role is required'),
                  }}
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel className="font-bold" color="blue-gray">
                          {t('Role')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t('Please select a role')}
                              />
                            </SelectTrigger>
                          </FormControl>

                          <SelectContent>
                            {Object.keys(RoleIdType).map((key, i) => {
                              return (
                                <SelectItem value={key} key={i}>
                                  <p className="capitalize">
                                    {key.toLowerCase()}
                                  </p>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
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
              <span>{t('Invite')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InviteUserDialog;
