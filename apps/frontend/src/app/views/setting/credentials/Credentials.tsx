import { Typography } from '@material-tailwind/react';
import CredentialTable from '../../../../components/Table/CredentialTable';
import DefaultButton from '../../../../components/Button/DefaultButton';
import { IoMdAdd } from 'react-icons/io';
import SearchCredentialTypeDialog from '../../../../components/Dialog/SearchCredentialTypeDialog';
import { useRef, useState } from 'react';
import { CredentialComponent } from '../../../util/type/CredentialComponent';
import CreateCredentialDialog from '../../../../components/Dialog/CreateCredentialDialog';
import { toast } from 'react-toastify';
type Props = {
  isActive: boolean;
};

const Credentials = ({ isActive }: Props) => {
  const tableRef = useRef<any>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<CredentialComponent | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  // const [credentialComponents] = useBoundStore((state) => [
  //   state.credentialComponents,
  // ]);
  const onSelectType = (type: CredentialComponent) => {
    console.log('[Selected]', type);
    setOpenSearch(false);
    setSelectedComponent(type);
    setOpenCreate(true);
  };

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
          <DefaultButton
            className="flex justify-center"
            onClick={() => {
              setOpenSearch(true);
            }}
          >
            <IoMdAdd className="w-4 h-4 my-auto" />
            <p className="my-auto ml-1 font-bold">Add</p>
          </DefaultButton>
        </div>
      </div>
      {isActive && <CredentialTable ref={tableRef} />}
      <SearchCredentialTypeDialog
        title="Add new credential"
        open={openSearch}
        onClose={() => {
          setOpenSearch(false);
        }}
        onSelect={onSelectType}
      />
      {selectedComponent && (
        <CreateCredentialDialog
          title={selectedComponent.label}
          open={openCreate}
          onClose={() => {
            setOpenCreate(false);
          }}
          onSuccess={() => {
            setOpenCreate(false);
            tableRef.current?.reload();
            toast.success('Credential created successfully');
            setTimeout(() => {
              setSelectedComponent(null);
            }, 500);
          }}
          type={selectedComponent}
        />
      )}
    </div>
  );
};

export default Credentials;
