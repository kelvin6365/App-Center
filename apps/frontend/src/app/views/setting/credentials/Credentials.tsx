import { Typography } from '@material-tailwind/react';
import CredentialTable from '../../../../components/Table/CredentialTable';
import DefaultButton from '../../../../components/Button/DefaultButton';
import { IoMdAdd } from 'react-icons/io';
type Props = {
  isActive: boolean;
};

const Credentials = ({ isActive }: Props) => {
  // const [credentialComponents] = useBoundStore((state) => [
  //   state.credentialComponents,
  // ]);

  return (
    <div>
      <div className="flex justify-between pb-2">
        <div>
          <Typography variant="h4" color="blue-gray" className="text-xl">
            Credentials
          </Typography>
          <Typography color="gray" className="mt-1 text-sm">
            Configurations for Credentials.
          </Typography>
        </div>
        <div>
          <DefaultButton className="flex justify-center">
            <IoMdAdd className="w-4 h-4 my-auto" />
            <p className="my-auto ml-1 font-bold">Add</p>
          </DefaultButton>
        </div>
      </div>
      {isActive && <CredentialTable />}
    </div>
  );
};

export default Credentials;
