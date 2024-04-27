import Loading from '@/components/loading';
import API from '@/services/api';
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
import useAvailableCredentialComponentsQuery from '../../queries/useAvailableCredentialComponentsQuery';
import { Credential } from '../../types/Credential';

type Props = {
  title: string;
  description?: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  credential: Credential | null;
};
type DeleteCredentialFormInputs = {
  id: string;
};
const DeleteCredentialDialog = ({
  title,
  onClose,
  open,
  credential,
  description,
}: Props) => {
  const t = useTranslations('Credentials');
  //Fetch credential components
  const { availableCredentialComponents, isLoading } =
    useAvailableCredentialComponentsQuery();
  const form = useForm<DeleteCredentialFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: credential?.id,
    },
  });
  const target = availableCredentialComponents.find(
    (c) => c.name === credential?.credentialName
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  useEffect(() => {
    if (open) {
      reset({
        id: credential?.id,
      });
    }
  }, [open, reset, credential]);

  const onSubmit: SubmitHandler<DeleteCredentialFormInputs> = async (
    values
  ) => {
    try {
      const res = await API.credential.deleteCredential(values.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { status }: { data: any; status: any } = res.data;
      console.log(status);
      if (status.code === 1000) {
        onClose(true);
        reset();
        toast.success('Delete successfully');
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
            reset();
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
                    {t('Are your sure to delete this credential')}{' '}
                  </h2>
                  <br />
                  <div className="text-left">
                    <div className="grid grid-cols-1 text-lg font-bold">
                      <div className="flex mx-auto">
                        <img
                          src={target?.icon}
                          alt={credential?.credentialName + ' icon'}
                          className="object-cover w-12 h-12 p-2 border rounded-full group-hover:bg-white"
                        />
                        <span className="my-auto ml-2">{credential?.name}</span>
                      </div>
                    </div>
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
              <span>{t('Confirm to Delete')}</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCredentialDialog;
