'use client';

import useUserProfileQuery from '@/queries/useUserProfileQuery';
import { formatDate } from '@/utils';
import {
  Badge,
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app-center/shadcn/ui';
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from '@radix-ui/react-icons';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import { useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { useDebounce } from 'use-debounce';
import useSearchTeamUsersQuery from '../../queries/useSearchTeamUsersQuery';
import useTeamSelectionStore from '../../stores/useTeamSelectionStore';
import { PortalUserProfile } from '../../types/PortalUserProfile';
import { RoleType } from '../../types/RoleType';
import DeleteUserFromTeamDialog from '../dialog/deleteDeleteUserFromTeamDialog';

export type TableRef = {
  reload: () => void;
};
const TeamMemberTable = React.forwardRef<TableRef>((_, ref) => {
  //Init state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  //Table Search / Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  const t = useTranslations('Members');

  //Current selected team
  const { selectedTeam } = useTeamSelectionStore();

  //Current User Profile Query
  const {
    userProfile,
    isLoading: isLoadingUserProfile,
    isError: isErrorUserProfile,
    refetch: refetchUserProfile,
  } = useUserProfileQuery();
  //Users query
  const {
    users,
    isLoading: isLoadingTeamMembers,
    isError: isErrorTeamMembers,
    refetch: refetchTeamMembers,
    isRefetching: isRefetchingTeamMembers,
  } = useSearchTeamUsersQuery({
    selectedTeam,
    page: currentPage,
    limit: itemsPerPage,
    searchQuery: debouncedSearchQuery,
    sorting: sorting.map((s) => ({
      key: s.id,
      value: s.desc ? 'DESC' : 'ASC',
    })),
  });

  //Delete Dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState<{
    open: boolean;
    data: PortalUserProfile | null;
  }>({
    open: false,
    data: null,
  });

  const columns = React.useMemo(
    (): ColumnDef<PortalUserProfile>[] => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: 'Name',
        accessorKey: 'profile.name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              {t('Name')}
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.profile.name}</div>,
      },
      {
        id: 'Username',
        accessorKey: 'username',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              {t('Username')}
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.username}</div>,
      },
      {
        id: 'Email',
        accessorKey: 'profile.email',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              {t('Email')}
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => <div>{row.original.profile.email}</div>,
      },
      {
        id: 'Role',
        accessorKey: 'roles.name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              {t('Role')}
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="flex space-x-2">
            {row.original.roles.map((r, i) => {
              if (r.type === RoleType.ADMIN) {
                return <Badge key={i}>{r.name}</Badge>;
              }
              return (
                <Badge key={i} variant="secondary">
                  {r.name}
                </Badge>
              );
            })}
          </div>
        ),
      },

      {
        id: 'Created At',
        accessorKey: 'createdAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="float-right p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              <div className="text-right">{t('Created At')}</div>
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-medium text-right">
              {formatDate(row.original.createdAt)}
            </div>
          );
        },
      },
      {
        id: 'Updated At',
        accessorKey: 'profile.updatedAt',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="float-right p-0"
              onClick={() => {
                column.toggleSorting(column.getIsSorted() === 'asc');
              }}
            >
              <div className="text-right">{t('Updated At')}</div>
              {!column.getIsSorted() && (
                <CaretSortIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'desc' && (
                <CaretDownIcon className="w-4 h-4 ml-2" />
              )}
              {column.getIsSorted() === 'asc' && (
                <CaretUpIcon className="w-4 h-4 ml-2" />
              )}
            </Button>
          );
        },
        cell: ({ row }) => {
          return (
            <div className="font-medium text-right">
              {formatDate(row.original.profile.updatedAt)}
            </div>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const version = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                  <span className="sr-only">{t('Open menu')}</span>
                  <DotsHorizontalIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('Actions')}</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(version.id).then(() => {
                      toast.success(t('Copied to clipboard'));
                    });
                  }}
                >
                  {t('Copy Member ID')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {userProfile && userProfile?.id !== row.original.id && (
                  <Link href={`/team/${row.original.id}`}>
                    <DropdownMenuItem>
                      <AiFillEdit className="w-5 h-5" />{' '}
                      <p className="ml-2">{t('Edit')}</p>
                    </DropdownMenuItem>
                  </Link>
                )}

                {userProfile && userProfile?.id !== row.original.id && (
                  <DropdownMenuItem
                    onClick={() => {
                      setOpenDeleteDialog({
                        open: true,
                        data: row.original,
                      });
                    }}
                  >
                    <AiFillDelete className="w-5 h-5 text-red-500" />{' '}
                    <p className="ml-2">{t('Remove from team')}</p>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const data: PortalUserProfile[] = React.useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [isLoadingTeamMembers, isRefetchingTeamMembers]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  useImperativeHandle(ref, () => ({
    reload: () => {
      refetchTeamMembers();
    },
  }));

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t('Filter Name or Email')}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('Columns')} <ChevronDownIcon className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {t(column.id.replace(/_/g, ' '))}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : !isLoadingTeamMembers ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('No results')}
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full  h-[50px] rounded" />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4 space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('of')}{' '}
          {table.getFilteredRowModel().rows.length} {t('rows selected')}.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('Previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('Next')}
          </Button>
        </div>
      </div>
      <DeleteUserFromTeamDialog
        open={openDeleteDialog.open}
        user={openDeleteDialog.data}
        onClose={() => {
          setOpenDeleteDialog({
            open: false,
            data: null,
          });
          refetchTeamMembers();
        }}
        title={t('Remove from team')}
      />
    </div>
  );
});
TeamMemberTable.displayName = 'TeamMemberTable';
export default TeamMemberTable;
