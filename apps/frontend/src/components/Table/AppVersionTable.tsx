import { Typography } from '@material-tailwind/react';
import { difference } from 'lodash';
import moment from 'moment';
import { BiSolidDownload } from 'react-icons/bi';
import { ImQrcode } from 'react-icons/im';
import Tag from '../Chip/Tag';
import { AppVersion, AppVersionTag } from '../../app/util/type/AppVersion';

type Props = {
  appVersions: AppVersion[];
  setOpenQRCode: (data: { data: string; open: boolean }) => void;
  selectedTags: AppVersionTag[];
};

const AppVersionTable = ({
  appVersions,
  setOpenQRCode,
  selectedTags,
}: Props) => {
  return (
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
            .map(
              (
                { id, name, description, tags, createdAt, fileURL, file },
                index
              ) => {
                const isLast = index === appVersions.length - 1;
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
                  </tr>
                );
              }
            )}
        </tbody>
      </table>
    </div>
  );
};

export default AppVersionTable;
