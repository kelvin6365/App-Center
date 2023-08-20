import { Typography } from '@material-tailwind/react';
import { difference } from 'lodash';
import moment from 'moment';
import { BiSolidDownload } from 'react-icons/bi';
import { ImQrcode } from 'react-icons/im';
import { AiFillDelete } from 'react-icons/ai';
import Tag from '../Chip/Tag';
import { AppVersion, AppVersionTag } from '../../app/util/type/AppVersion';
import axios from 'axios';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import API from '../../app/util/api';
import DeleteAppVersionDialog from '../Dialog/DeleteAppVersionDialog';

type Props = {
  appId: string;
  setOpenQRCode: (data: { data: string; open: boolean }) => void;
};

const AppVersionTable = forwardRef(({ appId, setOpenQRCode }: Props, ref) => {
  const [appVersions, setAppVersions] = useState<AppVersion[]>([]);
  const [appVersionTags, setAppVersionTags] = useState<AppVersionTag[]>([]);
  //selected Tags
  const [selectedTags, setSelectedTags] = useState<AppVersionTag[]>([]);
  //Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean;
    data: AppVersion | null;
  }>({
    open: false,
    data: null,
  });

  useImperativeHandle(ref, () => ({
    reload: () => {
      fetchAppVersionTags();
      fetchAppVersion();
    },
  }));

  const fetchAppVersion = useCallback(async () => {
    if (appId == null) {
      return;
    }
    try {
      const res = await API.app.appVersions(appId);
      const { data }: { data: AppVersion[] } = res.data;
      setAppVersions(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, [appId]);

  //Call API to get app version tags
  const fetchAppVersionTags = useCallback(async () => {
    if (appId == null) {
      return;
    }
    try {
      const res = await API.app.getAppVersionTags(appId);
      const { data }: { data: AppVersionTag[] } = res.data;
      setAppVersionTags(data);
      setSelectedTags(data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.status?.displayMessage.toString());
      }
    }
  }, [appId]);

  useEffect(() => {
    fetchAppVersionTags();
    fetchAppVersion();
  }, [fetchAppVersion, fetchAppVersionTags]);

  return (
    <>
      <div className="flex flex-wrap p-2 mb-2 border border-gray-300 rounded">
        {appVersionTags.map((tag) => {
          return (
            <Tag
              key={tag.id}
              onClick={() => {
                if (selectedTags.find((t) => t.name === tag.name)) {
                  setSelectedTags(
                    selectedTags.filter((t) => t.name !== tag.name)
                  );
                } else {
                  setSelectedTags([...selectedTags, tag]);
                }
                if (appId) {
                  fetchAppVersion();
                }
              }}
              className={'normal-case cursor-pointer my-2 mx-1'}
              value={tag.name}
              color={
                !selectedTags.find((t) => t.name === tag.name) ? 'gray' : 'blue'
              }
              variant={'outlined'}
            />
          );
        })}
      </div>
      <div className="overflow-y-auto">
        <table className="w-full text-left table-auto min-w-max ">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"></th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {'File Name'}
                </Typography>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {'Name'}
                </Typography>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {'Description'}
                </Typography>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  {'Tags'}
                </Typography>
              </th>

              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                >
                  Created At
                </Typography>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50"></th>
            </tr>
          </thead>
          <tbody>
            {appVersions
              .filter((av) => {
                const e = difference(
                  av.tags.map((t) => t.name),
                  selectedTags.map((st) => st.name)
                );
                //filter out tags that are not selected in arrays
                return av.tags.find((at) => !e.includes(at.name));
              })
              .map((data, index) => {
                const {
                  id,
                  name,
                  description,
                  tags,
                  createdAt,
                  fileURL,
                  file,
                } = data;
                const isLast =
                  index ===
                  appVersions.filter((av) => {
                    const e = difference(
                      av.tags.map((t) => t.name),
                      selectedTags.map((st) => st.name)
                    );
                    //filter out tags that are not selected in arrays
                    return av.tags.find((at) => !e.includes(at.name));
                  }).length -
                    1;
                const classes = isLast
                  ? 'p-4'
                  : 'p-4 border-b border-blue-gray-50';

                return (
                  <tr key={id} className="hover:bg-blue-gray-300/40">
                    <td className={classes}>
                      <div className="flex space-x-4">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="p-2 font-medium rounded-full hover:bg-white"
                          onClick={() => {
                            setOpenQRCode({
                              open: true,
                              data: fileURL,
                            });
                          }}
                        >
                          <ImQrcode className="w-5 h-5" />
                        </Typography>
                        <Typography
                          as="a"
                          href={fileURL}
                          variant="small"
                          color="blue-gray"
                          className="p-2 font-medium rounded-full hover:bg-white"
                        >
                          <BiSolidDownload className="w-5 h-5" />
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {file.name}
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
                        {description}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-wrap space-x-2">
                        {tags.map((tag) => {
                          return (
                            <Tag
                              key={tag.id}
                              className={'normal-case'}
                              value={tag.name}
                            />
                          );
                        })}
                      </div>
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
                            setOpenDeleteDialog({
                              open: true,
                              data: data,
                            });
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
      <DeleteAppVersionDialog
        open={openDeleteDialog.open}
        version={openDeleteDialog.data}
        onClose={() => {
          setOpenDeleteDialog({
            open: false,
            data: null,
          });
          fetchAppVersion();
          fetchAppVersionTags();
        }}
        title="Delete App Version"
      />
    </>
  );
});

export default AppVersionTable;
