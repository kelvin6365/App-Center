"use client";

import DeleteAppVersionDialog from "@/components/dialog/deleteVersionDialog";
import useAppVersionTagsQuery from "@/queries/useAppVersionTagsQuery";
import useSearchAppVersionsQuery from "@/queries/useSearchAppVersionsQuery";
import { AppVersion, AppVersionTag } from "@/types/AppVersion";
import { formatDate } from "@/utils";

import useUserProfileQuery from "@/queries/useUserProfileQuery";
import PermissionEnum from "@/types/Permission";
import { checkAllowAppActionPermission } from "@/utils/permissionChecking";
import {
  CaretDownIcon,
  CaretSortIcon,
  CaretUpIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import { Input } from "@repo/ui/components/ui/input";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";
import { cn } from "@repo/ui/lib/utils";
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
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useImperativeHandle, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { BiSolidDownload, BiSolidShareAlt } from "react-icons/bi";
import { ImQrcode } from "react-icons/im";
import { MdOutlineClear } from "react-icons/md";
import { SiJirasoftware } from "react-icons/si";
import { useDebounce } from "use-debounce";
import { App } from "../../types/App";

type Props = {
  app: App;
  setOpenQRCode: (data: { data: string; open: boolean }) => void;
  setOpenShareInstallURL: (data: {
    data: AppVersion | null;
    open: boolean;
  }) => void;
  setOpenJiraIssues: (data: { open: boolean; data: AppVersion | null }) => void;
};
export type TableRef = {
  reload: () => void;
  reloadJira: (id: string) => Promise<void>;
};
const AppVersionTable = React.forwardRef<TableRef, Props>(
  (
    { app, setOpenQRCode, setOpenShareInstallURL, setOpenJiraIssues }: Props,
    ref
  ) => {
    const t = useTranslations("Apps");

    const {
      userProfile,
      isLoading: isLoadingUserProfile,
      isError: isErrorUserProfile,
      refetch: refetchUserProfile,
    } = useUserProfileQuery();

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
      React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    //Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery] = useDebounce(searchQuery, 500);
    const [selectedTags, setSelectedTags] = useState<AppVersionTag[]>([]);

    //Delete Dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState<{
      open: boolean;
      data: AppVersion | null;
    }>({
      open: false,
      data: null,
    });

    const {
      appVersionTags,
      isLoading: isLoadingTags,
      isError: isErrorTags,
      refetch: refetchTags,
    } = useAppVersionTagsQuery({
      appId: app.id,
    });
    const {
      appVersions,
      isLoading: isLoadingVersions,
      isError: isErrorVersions,
      refetch: refetchVersions,
      isRefetching: isRefetchingVersions,
    } = useSearchAppVersionsQuery({
      appId: app.id,
      page: currentPage,
      limit: itemsPerPage,
      tags: selectedTags.map((t) => t.id),
      searchQuery: debouncedSearchQuery,
      sorting: sorting.map((s) => ({
        key: s.id,
        value: s.desc ? "DESC" : "ASC",
      })),
    });

    const columns = React.useMemo(
      (): ColumnDef<AppVersion>[] => [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
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
          id: "quick actions",
          header: t("Quick Actions"),
          enableHiding: false,
          cell: ({ row }) => {
            const {
              id,
              name,
              description,
              tags,
              createdAt,
              fileURL,
              file,
              jiraIssues,
            } = row.original;

            return (
              <TooltipProvider>
                <div className="flex space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="p-2 font-medium rounded-full cursor-pointer hover:bg-white dark:hover:bg-gray-600"
                        onClick={() => {
                          setOpenQRCode({
                            open: true,
                            data: fileURL,
                          });
                        }}
                      >
                        <ImQrcode className="w-5 h-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{t("Install QR Code")}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="p-2 font-medium rounded-full cursor-pointer hover:bg-white dark:hover:bg-gray-600"
                        onClick={() => {
                          setOpenShareInstallURL({
                            open: true,
                            data: row.original,
                          });
                        }}
                      >
                        <BiSolidShareAlt className="w-5 h-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{t("Public Share URL")}</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        className="p-2 font-medium rounded-full hover:bg-white dark:hover:bg-gray-600"
                        href={fileURL}
                      >
                        <BiSolidDownload className="w-5 h-5" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>{t("Download file")}</TooltipContent>
                  </Tooltip>

                  {jiraIssues.length > 0 && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="relative p-2 font-medium rounded-full cursor-pointer hover:bg-white dark:hover:bg-gray-600"
                          onClick={() => {
                            setOpenJiraIssues({
                              open: true,
                              data: row.original,
                            });
                          }}
                        >
                          <SiJirasoftware className="min-h-[24px] min-w-[24px] text-blue-500" />
                          <div className="absolute w-6 h-6 p-1 rounded-full top-[-10px] right-[-10px] bg-primary border-white border-[2px] text-center text-xs place-items-center text-white leading-none font-medium">
                            {jiraIssues.length}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>{t("Jira Issues")}</TooltipContent>
                    </Tooltip>
                    // <Badge
                    //   content={jiraIssues.length}
                    //   withBorder
                    //   color="blue"
                    // >
                    //   <Tooltip content="Jira Issues">
                    //     <Typography
                    //       variant="small"
                    //       color="blue-gray"
                    //       className="p-2 font-medium rounded-full hover:bg-white"
                    //       onClick={() => {
                    //         setOpenJiraIssues({
                    //           open: true,
                    //           data,
                    //         });
                    //       }}
                    //     >
                    //       <SiJirasoftware className="w-5 h-5 text-blue-500" />
                    //     </Typography>
                    //   </Tooltip>
                    // </Badge>
                  )}
                </div>
              </TooltipProvider>
            );
          },
        },
        {
          id: "name",
          accessorKey: "name",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                className="p-0"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc");
                }}
              >
                {t("Name")}
                {!column.getIsSorted() && (
                  <CaretSortIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "desc" && (
                  <CaretDownIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "asc" && (
                  <CaretUpIcon className="w-4 h-4 ml-2" />
                )}
              </Button>
            );
          },
          cell: ({ row }) => (
            <div className="capitalize">{row.original.name}</div>
          ),
        },
        {
          accessorKey: "description",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                className="p-0"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc");
                }}
              >
                {t("Description")}
                {!column.getIsSorted() && (
                  <CaretSortIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "desc" && (
                  <CaretDownIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "asc" && (
                  <CaretUpIcon className="w-4 h-4 ml-2" />
                )}
              </Button>
            );
          },
          cell: ({ row }) => (
            <div className="capitalize">{row.original.description}</div>
          ),
        },
        {
          accessorKey: "file.name",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                className="p-0"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc");
                }}
              >
                {t("File Name")}
                {!column.getIsSorted() && (
                  <CaretSortIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "desc" && (
                  <CaretDownIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "asc" && (
                  <CaretUpIcon className="w-4 h-4 ml-2" />
                )}
              </Button>
            );
          },
          cell: ({ row }) => <div>{row.original.file?.name ?? "-"}</div>,
        },
        {
          accessorKey: "tags",
          header: t("Tags"),
          cell: ({ row }) => (
            <div className="flex space-x-2">
              {row.original.tags.map((tag) => {
                return (
                  <Badge key={tag.id} className="cursor-default">
                    {tag.name}
                  </Badge>
                );
              })}
            </div>
          ),
        },
        {
          id: "created at",
          accessorKey: "createdAt",
          header: ({ column }) => {
            return (
              <Button
                variant="ghost"
                className="float-right p-0"
                onClick={() => {
                  column.toggleSorting(column.getIsSorted() === "asc");
                }}
              >
                <div className="text-right">{t("Created At")}</div>
                {!column.getIsSorted() && (
                  <CaretSortIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "desc" && (
                  <CaretDownIcon className="w-4 h-4 ml-2" />
                )}
                {column.getIsSorted() === "asc" && (
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
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
            const version = row.original;

            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">{t("Open menu")}</span>
                    <DotsHorizontalIcon className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("Actions")}</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(version.id).then(() => {
                        toast.success(t("Copied to clipboard"));
                      });
                    }}
                  >
                    {t("Copy Version ID")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {!isLoadingUserProfile &&
                    userProfile &&
                    checkAllowAppActionPermission(
                      userProfile,
                      [PermissionEnum.DELETE_APP_VERSION],
                      app.tenantId,
                      app.id
                    ) && (
                      <DropdownMenuItem
                        onClick={() => {
                          setOpenDeleteDialog({
                            open: true,
                            data: row.original,
                          });
                        }}
                      >
                        <AiFillDelete className="w-5 h-5 text-red-500" />{" "}
                        <p className="ml-2">{t("Delete")}</p>
                      </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ],
      [userProfile]
    );

    const data = React.useMemo(() => {
      return Array.isArray(appVersions) ? appVersions : [];
    }, [isLoadingVersions, isRefetchingVersions]);

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
        refetchTags();
        refetchVersions();
      },
      reloadJira: async (id: string) => {
        refetchTags();
        const { data } = await refetchVersions();
        const targetVersion = data?.items.find(
          (appVersion: AppVersion) => appVersion.id === id
        );
        if (targetVersion) {
          setOpenJiraIssues({
            open: true,
            data: targetVersion,
          });
        }
      },
    }));

    return (
      <div className="w-full">
        <div className="flex flex-wrap p-2 mb-2 border border-gray-300 rounded">
          {appVersionTags.map((tag) => {
            return (
              <Badge
                key={tag.id}
                onClick={() => {
                  if (selectedTags.find((t) => t.name === tag.name)) {
                    setSelectedTags(
                      selectedTags.filter((t) => t.name !== tag.name)
                    );
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                className={cn(
                  "normal-case cursor-pointer my-2 mx-1",
                  !selectedTags.find((t) => t.name === tag.name)
                    ? "bg-secondary"
                    : "bg-primary text-white"
                )}
                variant={"outline"}
              >
                {tag.name}
              </Badge>
            );
          })}
          {selectedTags.length > 0 && (
            <Badge
              className={"normal-case cursor-pointer my-2 mx-1 bg-secondary"}
              onClick={() => {
                setSelectedTags([]);
              }}
              variant={"secondary"}
            >
              <div className="flex space-x-1">
                <MdOutlineClear className="w-4 h-4 p-0 m-0" />
                <p>{t("Clear All")}</p>
              </div>
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1 py-4">
          <Input
            placeholder={t("Filter Name or description")}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                {t("Columns")} <ChevronDownIcon className="w-4 h-4 ml-2" />
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
                      {column.id.replace(/_/g, " ")}
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
                    data-state={row.getIsSelected() && "selected"}
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
              ) : !isLoadingVersions ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("No results")}
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
            {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
            {table.getFilteredRowModel().rows.length} {t("rows selected")}.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t("Previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("Next")}
            </Button>
          </div>
        </div>
        <DeleteAppVersionDialog
          open={openDeleteDialog.open}
          version={openDeleteDialog.data}
          onClose={() => {
            setOpenDeleteDialog({
              open: false,
              data: null,
            });
            refetchVersions();
            refetchTags();
          }}
          title={t("Delete App Version")}
        />
      </div>
    );
  }
);
AppVersionTable.displayName = "AppVersionTable";
export default AppVersionTable;
