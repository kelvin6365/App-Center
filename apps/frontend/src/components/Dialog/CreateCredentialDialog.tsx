import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { CredentialComponent } from '../../app/util/type/CredentialComponent';
import { useForm, Controller } from 'react-hook-form';
import API from '../../app/util/api';
import { omit } from 'lodash';
import { toast } from 'react-toastify';
import TextInput from '../Input/Input';
import { useAppStore } from '../../app/util/store/store';

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
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm();

  const [profile, selectedTenant] = useAppStore((state) => [
    state.profile,
    state.selectedTenant,
  ]);

  //Submit Create Credential
  const createCredential = async (e: Record<string, string>) => {
    if (!profile || !selectedTenant) {
      return;
    }
    try {
      const res = await API.credential.createCredential({
        name: e.name,
        credentialName: type.name,
        encryptedData: omit(e, ['name']),
        tenantId: selectedTenant?.id,
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
        <form
          id="form"
          className="flex flex-col gap-6 my-4"
          onSubmit={handleSubmit(createCredential)}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Name is required',
            }}
            render={({ field, fieldState: { error } }) => {
              return (
                <TextInput
                  label={'Name'}
                  {...field}
                  // variant="static"
                  disabled={isSubmitting}
                  error={error}
                />
              );
            }}
          />
          {type.inputs.map((input, index) => {
            return (
              <Controller
                key={index}
                name={input.name}
                control={control}
                rules={{
                  required: input.label + ' is required',
                }}
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TextInput
                      label={input.label}
                      {...field}
                      type={input.type as 'password' | 'text'}
                      // placeholder={input.placeholder}
                      helperText={input.placeholder}
                      // variant="static"
                      disabled={isSubmitting}
                      error={error}
                    />
                  );
                }}
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
