import { Typography } from '@material-tailwind/react';
import { difference } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { BiSolidShareAlt, BiSolidDownload } from 'react-icons/bi';
import { ImQrcode } from 'react-icons/im';
import Tag from '../Chip/Tag';
import API from '../../app/util/api';
import { Credential } from '../../app/util/type/Credential';

type Props = {
  isActive: boolean;
};

const CredentialTable = ({ isActive }: Props) => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
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
            <th className="p-4 bg-white border-b border-blue-gray-100"></th>
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
                {'Name'}
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
            const { id, name, credentialName, createdAt } = credential;
            const isLast = index === credentials.length - 1;
            const classes = isLast ? 'p-4' : 'p-4 border-b border-blue-gray-50';

            return (
              <tr key={id} className="hover:bg-blue-gray-300/20">
                <td className={classes}>
                  <div className="flex space-x-2"></div>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {credentialName}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {name}
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
