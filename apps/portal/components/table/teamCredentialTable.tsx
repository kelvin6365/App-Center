'use client';

import { formatDate } from '@/utils';
import {
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
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
import * as React from 'react';
import { useImperativeHandle, useState } from 'react';
import toast from 'react-hot-toast';
import { IoMdAdd } from 'react-icons/io';
import { useDebounce } from 'use-debounce';
import useSearchTeamCredentialsQuery from '../../queries/useSearchTeamCredentialsQuery';
import useTeamSelectionStore from '../../stores/useTeamSelectionStore';
import { Credential } from '../../types/Credential';
import { CredentialComponent } from '../../types/CredentialComponent';
import CreateCredentialDialog from '../dialog/createCredentialDialog';
import SearchCredentialTypeDialog from '../dialog/searchCredentialTypeDialog';
import useAvailableCredentialComponentsQuery from '../../queries/useAvailableCredentialComponentsQuery';
import DeleteCredentialDialog from '../dialog/deleteCredentialDialog';
import { AiFillDelete } from 'react-icons/ai';

export type TableRef = {
  reload: () => void;
};
const TeamCredentialTable = React.forwardRef<TableRef>((_, ref) => {
  const t = useTranslations('Credentials');

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

  //Current selected team
  const { selectedTeam } = useTeamSelectionStore();
  //Fetch credential components
  const { availableCredentialComponents, isLoading } =
    useAvailableCredentialComponentsQuery({
      selectedTeam,
    });

  //[Credentials Components]
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedComponent, setSelectedComponent] =
    useState<CredentialComponent | null>(null);
  const [openCreate, setOpenCreate] = useState(false);

  const onSelectType = (type: CredentialComponent) => {
    console.log('[Selected]', type);
    setOpenSearch(false);
    setSelectedComponent(type);
    setOpenCreate(true);
  };

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState<{
    open: boolean;
    credential: Credential | null;
  }>({
    open: false,
    credential: null,
  });

  //teamCredentials query
  const {
    teamCredentials,
    isLoading: isLoadingTeamCredentials,
    isError: isErrorTeamCredentials,
    isRefetching: isRefetchingTeamCredentials,
    refetch: refetchTeamCredentials,
  } = useSearchTeamCredentialsQuery({
    selectedTeam,
    page: currentPage,
    limit: itemsPerPage,
    searchQuery: debouncedSearchQuery,
    sorting: sorting.map((s) => ({
      key: s.id,
      value: s.desc ? 'DESC' : 'ASC',
    })),
  });

  const columns = React.useMemo(
    (): ColumnDef<Credential>[] => [
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
        accessorKey: 'name',
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
        cell: ({ row }) => {
          const target = availableCredentialComponents.find(
            (c) => c.name === row.original.credentialName
          );
          return (
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <img
                      src={target?.icon}
                      alt={row.original.credentialName + ' icon'}
                      className="object-cover w-12 h-12 p-2 border rounded-full group-hover:bg-white"
                    />
                  </TooltipTrigger>
                  <TooltipContent>{target?.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="my-auto font-normal">{row.original.name}</span>
            </div>
          );
        },
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
        accessorKey: 'updatedAt',
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
              {formatDate(row.original.updatedAt)}
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
                  {t('Copy ID')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDeleteConfirm({
                      open: true,
                      credential: row.original,
                    });
                  }}
                >
                  <AiFillDelete className="w-5 h-5 text-red-500" />{' '}
                  <p className="ml-2">{t('Delete')}</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [availableCredentialComponents]
  );

  const data: Credential[] = React.useMemo(() => {
    return Array.isArray(teamCredentials) ? teamCredentials : [];
  }, [isLoadingTeamCredentials, isRefetchingTeamCredentials]);

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
      refetchTeamCredentials();
    },
  }));

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t('Filter Name')}
          value={searchQuery}
          onChange={(event) => {
            setSearchQuery(event.target.value);
          }}
          className="max-w-sm"
        />
        <div className="ml-auto space-x-2">
          <Button
            onClick={() => {
              setOpenSearch(true);
            }}
          >
            {t('Add')} <IoMdAdd className="w-4 h-4 ml-2" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
            ) : !isLoadingTeamCredentials ? (
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
      <SearchCredentialTypeDialog
        title={t('Add new credential')}
        description={t(
          'This is how others will see your credentials on the site'
        )}
        open={openSearch}
        onClose={() => {
          setOpenSearch(false);
        }}
        onSelect={onSelectType}
      />
      <CreateCredentialDialog
        title={selectedComponent?.label ?? ''}
        open={openCreate}
        onClose={() => {
          setOpenCreate(false);
        }}
        onSuccess={() => {
          setOpenCreate(false);
          refetchTeamCredentials();
          toast.success(t('Created successfully'));
          setTimeout(() => {
            setSelectedComponent(null);
          }, 500);
        }}
        type={selectedComponent}
      />
      <DeleteCredentialDialog
        title={t('Delete credential')}
        open={openDeleteConfirm.open}
        credential={openDeleteConfirm.credential}
        onClose={(reload) => {
          if (reload) {
            refetchTeamCredentials();
          }
          setOpenDeleteConfirm({
            open: false,
            credential: null,
          });
        }}
      />
    </div>
  );
});
TeamCredentialTable.displayName = 'TeamCredentialTable';
export default TeamCredentialTable;
