import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { CredentialComponent } from '../../app/util/type/CredentialComponent';
import { useForm } from 'react-hook-form';
import TextInput from '../Input/TextInput';
import API from '../../app/util/api';
import { omit } from 'lodash';
import { toast } from 'react-toastify';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  type: CredentialComponent;
  onSuccess: () => void;
};

const CreateCredentialDialog = ({
  title,
  type,
  open,
  onClose,
  onSuccess,
}: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  //Submit Create Credential
  const createCredential = async (e: Record<string, string>) => {
    try {
      const res = await API.credential.createCredential({
        name: e.name,
        credentialName: type.name,
        encryptedData: omit(e, ['name']),
      });
      if (!res.data.data) {
        throw new Error('Credential create failed');
      }
      reset();
      onSuccess();
    } catch (error) {
      console.log(error);
      toast.error('Credential create failed');
    }
  };

  return (
    <Dialog
      open={open}
      handler={() => {
        reset();
        onClose();
      }}
      className="!max-w-[320px] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader className="flex">
        <img
          src={type?.icon}
          alt={type.label + ' icon'}
          className="object-cover w-12 h-12 p-2 rounded-full group-hover:bg-white"
        />
        <p className="my-auto ml-2">{title}</p>
      </DialogHeader>
      <DialogBody divider>
        <div
          className="mb-2"
          dangerouslySetInnerHTML={{ __html: type.description }}
        />
        <form id="form" onSubmit={handleSubmit(createCredential)}>
          <TextInput
            label={'Name'}
            {...register('name', {
              required: {
                value: true,
                message: 'Name is required',
              },
            })}
            loading={isSubmitting}
            errors={errors}
          />
          {type.inputs.map((input, index) => {
            return (
              <TextInput
                key={index}
                label={input.label}
                {...register(input.name, {
                  required: {
                    value: true,
                    message: input.label + 'is required',
                  },
                })}
                type={input.type}
                placeholder={input.placeholder}
                loading={isSubmitting}
                errors={errors}
              />
            );
          })}
        </form>
      </DialogBody>
      <DialogFooter>
        <Button variant="gradient" type="submit" form="form">
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default CreateCredentialDialog;
