import { Checkbox, Typography } from '@material-tailwind/react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import axios from 'axios';
import moment from 'moment';
import {
  HTMLProps,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ensuredForwardRef } from 'react-use';
import API from '../../app/util/api';
import { Meta } from '../../app/util/type/Meta';
import { DefaultPagination } from '../Pagination/Pagination';
import Loading from '../Loading/Loading';
import { PortalUserProfile } from '../../app/util/type/PortalUserProfile';

export type UserTableRef = {
  refresh: () => void;
};
type Props = {
  enableFooter: boolean;
  supperSearch: string;
  page: number;
};

function IndeterminateCheckbox({
  indeterminate,
  className = '',
  checked,
  onChange,
  disabled,
}: // ...rest
{ indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = !checked && indeterminate;
      }
    }
  }, [ref, indeterminate, checked]);

  return (
    <Checkbox
      type="checkbox"
      className={className + ' cursor-pointer'}
      // {...rest}
      disabled={disabled}
      checked={checked}
      onChange={onChange}
      inputRef={ref}
      color="blue"
    />
  );
}

const UserTable = ensuredForwardRef<UserTableRef, Props>(
  (
    { enableFooter, supperSearch, page }: Props,
    ref: React.Ref<UserTableRef>
  ) => {
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState({});
    const [data, setData] = useState<PortalUserProfile[]>([]);
    // const itemsPerPage = 20;

    const [totalPages, setTotalPages] = useState(0);

    //isLoading
    const [isLoading, setIsLoading] = useState(true);

    const columns: ColumnDef<PortalUserProfile>[] = [
      {
        id: 'select',
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => {
          return (
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          );
        },
      },
      {
        id: 'id',
        accessorFn: (row) => row.id,
        cell: (info) => info.getValue(),
      },
      {
        accessorFn: (row) => row.username,
        id: 'username',
        cell: (info) => <i>{info.getValue<string>()}</i>,
        header: () => <span>Username</span>,
      },
      {
        accessorFn: (row) => row.profile.name,
        id: 'profile.name',
        cell: (info) => <i>{info.getValue<string>()}</i>,
        header: () => <span>Name</span>,
      },
      {
        accessorFn: (row) => row.status,
        id: 'status',
        cell: (info) => <i>{info.getValue<string>()}</i>,
        header: () => <span>Status</span>,
      },
      {
        accessorFn: (row) => row.createdAt,
        id: 'createdAt',
        cell: (info) => (
          <i>
            {moment(info.getValue<string>()).format('DD/MM/YYYY HH:mm:ss A')}
          </i>
        ),
        header: () => <span>Created At</span>,
      },
      {
        accessorFn: (row) => row.updatedAt,
        id: 'updatedAt',
        cell: (info) => (
          <i>
            {moment(info.getValue<string>()).format('DD/MM/YYYY HH:mm:ss A')}
          </i>
        ),
        header: () => <span>Last Updated</span>,
      },
      {
        accessorFn: (row) => row.deletedAt,
        id: 'deletedAt',
        cell: (info) => <i>{info.getValue<string>()}</i>,
        header: () => <span>Deleted At</span>,
      },
    ];
    const table = useReactTable<PortalUserProfile>({
      data: data,
      columns,
      getRowId: (row, relativeIndex, parent) =>
        parent ? [parent.id, row.id].join('.') : row.id,
      getCoreRowModel: getCoreRowModel(),
      onRowSelectionChange: (rows) => {
        setSelectedRows(rows);
      },
      state: {
        rowSelection: selectedRows,
        columnVisibility: {
          id: false,
        },
      },
    });

    const searchUser = useCallback(async () => {
      try {
        if (!isLoading) {
          setIsLoading(true);
        }
        //search api
        const res = await API.user
          .searchUsers
          //   {
          //   page: page,
          //   limit: itemsPerPage,
          //   query: JSON.stringify({
          //     query: supperSearch ?? '',
          //   }),
          // }
          ();
        const { data }: { data: { items: []; meta: Meta } } = res.data;
        const { items, meta }: { items: []; meta: Meta } = data;
        setData(items);
        setTotalPages(meta.totalPages);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.status?.displayMessage.toString());
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supperSearch, page]);

    useImperativeHandle(ref, () => {
      return {
        refresh: () => {
          searchUser();
        },
      };
    });

    useEffect(() => {
      searchUser();
    }, [searchUser]);

    return (
      <>
        {isLoading && (
          <div className="py-12">
            <Loading />
          </div>
        )}
        <div className="overflow-auto">
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
                      className="p-4 cursor-pointer hover:bg-blue-400/30"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className={classes}
                          onClick={() => {
                            if (cell.column.id === 'select') {
                              return;
                            }
                            navigate('/users/' + row.original.id);
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
                              className="font-normal cursor-pointer"
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
        <div className="py-2 ml-auto">
          <DefaultPagination
            activePage={page}
            totalPages={totalPages}
            onPageChange={(latestPage: number) => {
              console.log(latestPage);
              navigate('/users/all', {
                state: { page: latestPage, supperSearch: supperSearch },
              });
            }}
          />
        </div>
      </>
    );
  }
);

export default UserTable;
