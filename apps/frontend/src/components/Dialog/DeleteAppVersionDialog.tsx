import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AppVersion } from '../../app/util/type/AppVersion';
import API from '../../app/util/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect } from 'react';

type Props = {
  title: string;
  onClose: (reload: boolean) => void;
  open: boolean;
  version: AppVersion | null;
};

type DeleteVersionFormInputs = {
  id: string;
  versionId: string;
};

const DeleteAppVersionDialog = ({ title, onClose, open, version }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DeleteVersionFormInputs>({
    // resolver: yupResolver<Inputs>(schema),
    defaultValues: {
      id: version?.appId,
      versionId: version?.id,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        id: version?.appId,
        versionId: version?.id,
      });
    }
  }, [open, reset, version]);

  const onSubmit: SubmitHandler<DeleteVersionFormInputs> = async (values) => {
    try {
      const res = await API.app.deleteVersion(values.id, values.versionId);
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
          <input {...register('versionId')} hidden />
          <div className="flex">
            <div className="m-auto">
              <h2 className="text-xl font-bold text-red-500">
                Are your sure to delete this version?{' '}
              </h2>
              <br />
              <div className="text-left">
                <p className="grid grid-cols-2 text-lg font-bold ">
                  <p>Name:</p> <p>{version?.name}</p>
                </p>
                <p className="grid grid-cols-2 text-lg font-bold ">
                  <p>Description:</p> <p>{version?.description}</p>
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

export default DeleteAppVersionDialog;
