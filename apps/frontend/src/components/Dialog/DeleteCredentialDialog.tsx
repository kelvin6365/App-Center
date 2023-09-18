import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import axios from 'axios';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../../app/util/api';
import { Credential } from '../../app/util/type/Credential';
import { useBoundStore } from '../../app/util/store/store';

type Props = {
  title: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  credential: Credential | null;
};

type DeleteFormInputs = {
  id: string;
};

const DeleteCredentialDialog = ({
  title,
  onClose,
  open,
  credential,
}: Props) => {
  const [credentialComponents] = useBoundStore((state) => [
    state.credentialComponents,
  ]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<DeleteFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: credential?.id,
    },
  });
  const target = credentialComponents.find(
    (c) => c.name === credential?.credentialName
  );

  useEffect(() => {
    if (open) {
      reset({
        id: credential?.id,
      });
    }
  }, [credential?.id, open, reset]);

  //delete a credential
  const onSubmit: SubmitHandler<DeleteFormInputs> = async (
    values: DeleteFormInputs
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
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  };

  return (
    <Dialog
      open={open}
      handler={() => {
        if (!isSubmitting) {
          reset();
          onClose(false);
        }
      }}
      className="!max-w-[40%] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider className="">
        <form
          id="form"
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-screen-sm mx-auto mt-8 mb-8"
        >
          <input {...register('id')} hidden />
          <div className="flex">
            <div className="m-auto">
              <h2 className="text-xl font-bold text-red-500">
                Are your sure to delete this credential?{' '}
              </h2>
              <br />
              <div className="text-left">
                <p className="grid grid-cols-1 text-lg font-bold">
                  <div className="flex mx-auto">
                    <img
                      src={target?.icon}
                      alt={credential?.credentialName + ' icon'}
                      className="object-cover w-12 h-12 p-2 border rounded-full group-hover:bg-white"
                    />
                    <p className="my-auto ml-2">{credential?.name}</p>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="justify-center">
        <Button
          variant="gradient"
          type="submit"
          form="form"
          className="!to-red-500 !from-red-500 !shadow-red-500/20"
          disabled={isSubmitting}
        >
          <span>Confirm to Delete</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default DeleteCredentialDialog;
