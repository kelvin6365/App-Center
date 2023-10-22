import { Checkbox, Typography } from '@material-tailwind/react';
import {
  ColumnDef,
  TableState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import { useAppStore } from '../../app/util/store/store';
import { App } from '../../app/util/type/App';
import {
  AppsPermission,
  PortalUserProfile,
} from '../../app/util/type/PortalUserProfile';
import Loading from '../Loading/Loading';

export type UserAppPermissionsTableRef = {
  refresh: () => void;
  getState: () => TableState & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    oldUserPermissions: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userPermissions: any;
  };
  addUser: (user: PortalUserProfile) => void;
};
type Props = {
  enableFooter: boolean;
  supperSearch: string;
  page: number;
  app: App;
};

const UserAppPermissionsTable = forwardRef(
  ({ enableFooter, supperSearch, page, app }: Props, ref) => {
    const [data, setData] = useState<PortalUserProfile[]>([]);
    const [selectedTenant] = useAppStore((state) => [state.selectedTenant]);
    // const itemsPerPage = 20;

    //isLoading
    const [isLoading, setIsLoading] = useState(true);
    const [userPermissions, setUserPermissions] = useState<{
      [key: string]: {
        [key: string]: boolean;
      };
    }>({});
    const [oldUserPermissions, setOldUserPermissions] = useState<{
      [key: string]: {
        [key: string]: boolean;
      };
    }>({});

    const columns: ColumnDef<PortalUserProfile>[] = [
      {
        id: 'id',
        accessorFn: (row) => row.id,
        cell: (info) => info.getValue(),
      },
      {
        id: 'user',

        cell: ({ row }) => (
          <div className="grid grid-cols-1">
            <i className="font-bold">{row.original.profile.name}</i>
            <i className="font-light">{row.original.username}</i>
          </div>
        ),
        header: () => <span>User</span>,
      },
      {
        size: 80,
        maxSize: 80,
        accessorFn: (row) => row.permissions,
        id: 'permissions.view',
        cell: ({ row }) => {
          const permission =
            userPermissions?.[row.original.id]?.[AppsPermission.VIEW_APP] ??
            false;
          return (
            <Checkbox
              type="checkbox"
              className={'cursor-pointer'}
              color="blue"
              defaultChecked={permission ? true : false}
              onChange={(e) => {
                table.options.meta?.setUserAppPermissions(row.original, {
                  [AppsPermission.VIEW_APP]: e.target.checked,
                });
              }}
            />
          );
        },
        header: () => <span>View</span>,
      },
      {
        size: 80,
        maxSize: 80,
        accessorFn: (row) => row.permissions,
        id: 'permissions.edit',
        cell: ({ row }) => {
          const permission =
            userPermissions?.[row.original.id]?.[AppsPermission.EDIT_APP] ??
            false;
          return (
            <Checkbox
              type="checkbox"
              className={'cursor-pointer'}
              color="blue"
              defaultChecked={permission ? true : false}
              onChange={(e) => {
                table.options.meta?.setUserAppPermissions(row.original, {
                  [AppsPermission.EDIT_APP]: e.target.checked,
                });
              }}
            />
          );
        },
        header: () => <span>Edit</span>,
      },
      {
        size: 80,
        maxSize: 80,
        accessorFn: (row) => row.permissions,
        id: 'permissions.uploadVersion',
        cell: ({ row }) => {
          const permission =
            userPermissions?.[row.original.id]?.[
              AppsPermission.CREATE_APP_VERSION
            ] ?? false;
          return (
            <Checkbox
              type="checkbox"
              className={'cursor-pointer'}
              color="blue"
              defaultChecked={permission ? true : false}
              onChange={(e) => {
                table.options.meta?.setUserAppPermissions(row.original, {
                  [AppsPermission.CREATE_APP_VERSION]: e.target.checked,
                });
              }}
            />
          );
        },
        header: () => <span>Upload Version</span>,
      },
      {
        size: 80,
        maxSize: 80,
        accessorFn: (row) => row.permissions,
        id: 'permissions.uploadVersion',
        cell: ({ row }) => {
          const permission =
            userPermissions?.[row.original.id]?.[
              AppsPermission.DELETE_APP_VERSION
            ] ?? false;
          return (
            <Checkbox
              type="checkbox"
              className={'cursor-pointer'}
              color="blue"
              defaultChecked={permission ? true : false}
              onChange={(e) => {
                table.options.meta?.setUserAppPermissions(row.original, {
                  [AppsPermission.DELETE_APP_VERSION]: e.target.checked,
                });
              }}
            />
          );
        },
        header: () => <span>Delete Version</span>,
      },
    ];
    const table = useReactTable<PortalUserProfile>({
      data: data,
      columns,
      getRowId: (row, _, parent) =>
        parent ? [parent.id, row.id].join('.') : row.id,
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnVisibility: {
          id: false,
        },
      },
      meta: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setUserAppPermissions: (old: any, current: any) => {
          setUserPermissions({
            ...userPermissions,
            [old.id]: {
              ...userPermissions[old.id],
              ...current,
            },
          });
        },
      },
    });

    const searchUser = useCallback(async () => {
      if (!selectedTenant) {
        return;
      }
      try {
        if (!isLoading) {
          setIsLoading(true);
        }
        //search api
        const res = await API.user.getUserAppPermissionsList(app.id);
        const { data }: { data: PortalUserProfile[] } = res.data;
        setData(data);
        const up: {
          [key: string]: {
            [key: string]: boolean;
          };
        } = {};
        for (let ui = 0; ui < data.length; ui++) {
          up[data[ui].id as string] = {
            [AppsPermission.VIEW_APP]: data[ui].permissions.find(
              (permission) => permission.id === AppsPermission.VIEW_APP
            )
              ? true
              : false,
            [AppsPermission.EDIT_APP]: data[ui].permissions.find(
              (permission) => permission.id === AppsPermission.EDIT_APP
            )
              ? true
              : false,
            [AppsPermission.CREATE_APP_VERSION]: data[ui].permissions.find(
              (permission) =>
                permission.id === AppsPermission.CREATE_APP_VERSION
            )
              ? true
              : false,
            [AppsPermission.DELETE_APP_VERSION]: data[ui].permissions.find(
              (permission) =>
                permission.id === AppsPermission.DELETE_APP_VERSION
            )
              ? true
              : false,
          };
        }
        setUserPermissions(up);
        setOldUserPermissions(up);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.status?.displayMessage.toString());
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supperSearch, page, selectedTenant?.id]);

    useImperativeHandle(ref, () => {
      return {
        refresh: () => {
          searchUser();
        },
        getState: () => ({
          userPermissions: userPermissions,
          oldUserPermissions: oldUserPermissions,
        }),
        addUser: (user: PortalUserProfile) => {
          const users = [user, ...data.filter((u) => u.id !== user.id)];
          setData(users);
        },
      };
    });

    useEffect(() => {
      searchUser();
    }, [searchUser, selectedTenant?.id]);

    return (
      <>
        {isLoading && (
          <div className="flex w-full">
            <div className="py-12 mx-auto">
              <Loading />
            </div>
          </div>
        )}
        <div className="min-w-full overflow-auto">
          {!isLoading && (
            <table className="w-full text-left rounded-md table-auto min-w-max overflow-clip">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-4 border-b border-blue-gray-100 bg-blue-gray-50/50"
                      >
                        {header.column.id === 'select' ? (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        ) : (
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </Typography>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row, index) => {
                  const isLast = index === data.length - 1;
                  const classes = isLast
                    ? 'p-4'
                    : 'p-4 border-b border-blue-gray-50';

                  return (
                    <tr
                      key={row.original.id}
                      className="p-4 hover:bg-blue-400/30"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={classes}
                          onClick={() => {
                            if (cell.column.id === 'select') {
                              return;
                            }
                          }}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {cell.column.id === 'select' ? (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          ) : (
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Typography>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
              {enableFooter && (
                <tfoot>
                  {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.footer,
                                header.getContext()
                              )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              )}
            </table>
          )}
        </div>

        <div className="my-2 bg-gray-300 h-[1px] opacity-40" />
      </>
    );
  }
);

export default UserAppPermissionsTable;
