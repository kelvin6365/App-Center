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
} from '@app-center/shadcn/ui';
import axios from 'axios';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { PortalUserProfile } from '../../types/PortalUserProfile';
import API from '../../services/api';

type Props = {
  title: string;
  description?: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  user: PortalUserProfile | null;
};
type DeleteVersionFormInputs = {
  id: string;
};
const DeleteUserFromTeamDialog = ({
  title,
  onClose,
  open,
  user,
  description,
}: Props) => {
  const t = useTranslations('Members');

  const form = useForm<DeleteVersionFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: user?.id,
    },
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        id: user?.id,
      });
    }
  }, [open, reset, user]);

  const onSubmit: SubmitHandler<DeleteVersionFormInputs> = async (values) => {
    try {
      const res = await API.user.removeUserFromTenant({
        userId: values.id,
      });
      const { status } = res.data;
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success(t('Remove Successfully'));
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };
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
            onClose(false);
          }
        }}
        // className="!max-w-[70%] !w-full max-h-[85%] overflow-scroll"
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              id="form"
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-screen-sm mx-auto mt-8 mb-8"
            >
              <input {...register('id')} hidden />
              <div className="flex">
                <div className="m-auto">
                  <h2 className="text-xl font-bold text-red-500">
                    {t('Are you sure you want to remove this user')}
                  </h2>
                  <br />
                  <div className="text-left">
                    <p className="grid grid-cols-2 text-lg font-bold ">
                      <p>{t('Name')}:</p> <p>{user?.profile?.name}</p>
                    </p>
                    <p className="grid grid-cols-2 text-lg font-bold ">
                      <p>{t('Username')}:</p> <p>{user?.username}</p>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!isSubmitting) {
                  handleSubmit(onSubmit)();
                }
              }}
              disabled={isSubmitting}
            >
              <span>{t('Confirm to Remove')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteUserFromTeamDialog;
