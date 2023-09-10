import { Tooltip, Typography } from '@material-tailwind/react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import API from '../../app/util/api';
import { useBoundStore } from '../../app/util/store/store';
import { Credential } from '../../app/util/type/Credential';

type Props = {
  isActive: boolean;
};

const CredentialTable = ({ isActive }: Props) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [credentialComponents] = useBoundStore((state) => [
    state.credentialComponents,
  ]);

  //Fetch all credentials
  const fetchCredentials = async () => {
    try {
      const res = await API.credential.getAllCredentials();
      console.log(res.data);
      const { data } = res.data;
      setCredentials(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isActive) {
      console.log('[Is Active] Start fetch');
      fetchCredentials();
    }
  }, [isActive]);
  return (
    <div className="overflow-y-auto">
      <table className="w-full text-left table-auto min-w-max ">
        <thead>
          <tr>
            <th className="p-4 bg-white border-b border-blue-gray-100">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-bold leading-none opacity-70"
              >
                {'Name'}
              </Typography>
            </th>
            <th className="p-4 bg-white border-b border-blue-gray-100">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-bold leading-none opacity-70"
              >
                Last Update At
              </Typography>
            </th>
            <th className="p-4 bg-white border-b border-blue-gray-100">
              <Typography
                variant="small"
                color="blue-gray"
                className="font-bold leading-none opacity-70"
              >
                Created At
              </Typography>
            </th>
            <th className="p-4 bg-white border-b border-blue-gray-100"></th>
          </tr>
        </thead>
        <tbody>
          {credentials.map((credential, index) => {
            const { id, name, credentialName, createdAt, updatedAt } =
              credential;
            const isLast = index === credentials.length - 1;
            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';
            const target = credentialComponents.find(
              (c) => c.name === credentialName
            );
            return (
              <tr key={id} className="hover:bg-blue-gray-300/20 group">
                <td className={classes}>
                  <div className="flex space-x-2">
                    <Tooltip content={target?.label}>
                      <img
                        src={target?.icon}
                        alt={credentialName + ' icon'}
                        className="object-cover w-12 h-12 p-2 border rounded-full group-hover:bg-white"
                      />
                    </Tooltip>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="my-auto font-normal"
                    >
                      {name}
                    </Typography>
                  </div>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {moment(updatedAt).format('YYYY-MM-DD HH:mm:ss a')}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {moment(createdAt).format('YYYY-MM-DD HH:mm:ss a')}
                  </Typography>
                </td>
                <td className={classes}>
                  <div className="flex space-x-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="p-2 font-medium rounded-full hover:bg-white"
                      onClick={() => {
                        //   setOpenDeleteDialog({
                        //     open: true,
                        //     data: data,
                        //   });
                      }}
                    >
                      <AiFillEdit className="w-5 h-5 text-gray-500" />
                    </Typography>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="p-2 font-medium rounded-full hover:bg-white"
                      onClick={() => {
                        //   setOpenDeleteDialog({
                        //     open: true,
                        //     data: data,
                        //   });
                      }}
                    >
                      <AiFillDelete className="w-5 h-5 text-red-500" />
                    </Typography>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CredentialTable;
