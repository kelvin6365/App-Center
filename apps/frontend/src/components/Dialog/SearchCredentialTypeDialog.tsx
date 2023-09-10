import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import { useForm } from 'react-hook-form';
import { useBoundStore } from '../../app/util/store/store';
import { CredentialComponent } from '../../app/util/type/CredentialComponent';
import TextInput from '../Input/TextInput';

type Props = {
  title: string;
  onClose: () => void;
  open: boolean;
  onSelect: (component: CredentialComponent) => void;
};

const SearchCredentialTypeDialog = ({
  title,
  onClose,
  open,
  onSelect,
}: Props) => {
  const [credentialComponents] = useBoundStore((state) => [
    state.credentialComponents,
  ]);

  const {
    register,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      search: '',
    },
    shouldFocusError: false,
  });

  //Search credential name with case sensitive
  const searchCredentialName = watch('search');

  return (
    <Dialog
      open={open}
      handler={() => {
        setValue('search', '');
        onClose();
      }}
      className="!max-w-[320px] !w-full max-h-[85%] overflow-scroll"
    >
      <DialogHeader>{title}</DialogHeader>
      <DialogBody divider>
        <div className="w-full">
          <TextInput
            {...register('search', {})}
            placeholder={'Search Credential Type'}
            loading={isSubmitting}
            errors={errors}
          />
        </div>
        {credentialComponents
          .filter(
            (c) =>
              c.label
                .toLowerCase()
                .indexOf(searchCredentialName.toLowerCase()) !== -1
          )
          .map((component, i) => (
            <div
              key={i}
              className="flex px-4 py-2 rounded-md cursor-pointer hover:bg-purple-200/30 group"
              onClick={() => onSelect(component)}
            >
              <img
                src={component?.icon}
                alt={component.label + ' icon'}
                className="object-cover w-12 h-12 p-2 rounded-full group-hover:bg-white"
              />
              <p className="my-auto ml-3 text-sm">{component.label}</p>
            </div>
          ))}
      </DialogBody>
      <DialogFooter>
        <Button
          variant="gradient"
          onClick={() => {
            setValue('search', '');
            onClose();
          }}
        >
          <span>Done</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default SearchCredentialTypeDialog;
