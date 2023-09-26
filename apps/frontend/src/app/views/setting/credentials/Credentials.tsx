import { MainButton } from '@app-center/shared-ui';
import { Typography } from '@material-tailwind/react';
import { useRef, useState } from 'react';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import CreateCredentialDialog from '../../../../components/Dialog/CreateCredentialDialog';
import DeleteCredentialDialog from '../../../../components/Dialog/DeleteCredentialDialog';
import SearchCredentialTypeDialog from '../../../../components/Dialog/SearchCredentialTypeDialog';
import CredentialTable from '../../../../components/Table/CredentialTable';
import { Credential } from '../../../util/type/Credential';
import { CredentialComponent } from '../../../util/type/CredentialComponent';
type Props = {
  isActive: boolean;
};

const Credentials = ({ isActive }: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableRef = useRef<any>(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<CredentialComponent | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<{
    open: boolean;
    credential: Credential | null;
  }>({
    open: false,
    credential: null,
  });
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
          <MainButton
            className="flex justify-center"
            onClick={() => {
              setOpenSearch(true);
            }}
          >
            <IoMdAdd className="w-4 h-4 my-auto" />
            <p className="my-auto ml-1 font-bold">Add</p>
          </MainButton>
        </div>
      </div>
      {isActive && (
        <CredentialTable
          ref={tableRef}
          setOpenDeleteConfirm={setOpenDeleteConfirm}
        />
      )}
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
      <DeleteCredentialDialog
        title={'Delete credential'}
        open={openDeleteConfirm.open}
        credential={openDeleteConfirm.credential}
        onClose={(reload) => {
          if (reload) {
            tableRef.current?.reload();
          }
          setOpenDeleteConfirm({
            open: false,
            credential: null,
          });
        }}
      />
    </div>
  );
};

export default Credentials;
