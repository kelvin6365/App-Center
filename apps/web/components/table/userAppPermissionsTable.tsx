import Loading from "@/components/loading";
import API from "@/services/api";
import useTeamSelectionStore from "@/stores/useTeamSelectionStore";
import { App } from "@/types/App";
import { AppsPermission, PortalUserProfile } from "@/types/PortalUserProfile";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Label } from "@repo/ui/components/ui/label";
import {
  ColumnDef,
  TableState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { useTranslations } from "next-intl";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";

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
    const t = useTranslations("Apps");
    const [data, setData] = useState<PortalUserProfile[]>([]);

    const { selectedTeam } = useTeamSelectionStore();
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

    const columns: ColumnDef<PortalUserProfile>[] = useMemo(() => {
      return [
        {
          id: "id",
          accessorFn: (row) => row.id,
          cell: (info) => info.getValue(),
        },
        {
          id: "user",

          cell: ({ row }) => (
            <div className="grid grid-cols-1">
              <i className="font-bold">{row.original.profile.name}</i>
              <i className="font-light">{row.original.username}</i>
            </div>
          ),
          header: () => <span>{t("User")}</span>,
        },
        {
          size: 80,
          maxSize: 80,
          accessorFn: (row) => row.permissions,
          id: "permissions.view",
          cell: ({ row }) => {
            const permission =
              userPermissions?.[row.original.id]?.[AppsPermission.VIEW_APP] ??
              false;
            return (
              <Checkbox
                className={"cursor-pointer"}
                color="blue"
                defaultChecked={permission ? true : false}
                onCheckedChange={(e) => {
                  setUserAppPermissions(row.original, {
                    [AppsPermission.VIEW_APP]: e,
                  });
                }}
              />
            );
          },
          header: () => <span>{t("View")}</span>,
        },
        {
          size: 80,
          maxSize: 80,
          accessorFn: (row) => row.permissions,
          id: "permissions.edit",
          cell: ({ row }) => {
            const permission =
              userPermissions?.[row.original.id]?.[AppsPermission.EDIT_APP] ??
              false;
            return (
              <Checkbox
                className={"cursor-pointer"}
                color="blue"
                defaultChecked={permission ? true : false}
                onCheckedChange={(e) => {
                  setUserAppPermissions(row.original, {
                    [AppsPermission.EDIT_APP]: e,
                  });
                }}
              />
            );
          },
          header: () => <span>{t("Edit")}</span>,
        },
        {
          size: 80,
          maxSize: 80,
          accessorFn: (row) => row.permissions,
          id: "permissions.editVersion",
          cell: ({ row }) => {
            const permission =
              userPermissions?.[row.original.id]?.[
                AppsPermission.CREATE_APP_VERSION
              ] ?? false;
            return (
              <Checkbox
                className={"cursor-pointer"}
                color="blue"
                defaultChecked={permission ? true : false}
                onCheckedChange={(e) => {
                  setUserAppPermissions(row.original, {
                    [AppsPermission.CREATE_APP_VERSION]: e,
                  });
                }}
              />
            );
          },
          header: () => <span>{t("Upload Version")}</span>,
        },
        {
          size: 80,
          maxSize: 80,
          accessorFn: (row) => row.permissions,
          id: "permissions.deleteVersion",
          cell: ({ row }) => {
            const permission =
              userPermissions?.[row.original.id]?.[
                AppsPermission.DELETE_APP_VERSION
              ] ?? false;
            return (
              <Checkbox
                className={"cursor-pointer"}
                color="blue"
                defaultChecked={permission ? true : false}
                onCheckedChange={(e) => {
                  setUserAppPermissions(row.original, {
                    [AppsPermission.DELETE_APP_VERSION]: e,
                  });
                }}
              />
            );
          },
          header: () => <span>{t("Delete Version")}</span>,
        },
      ];
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userPermissions]);

    const table = useReactTable<PortalUserProfile>({
      data: data,
      columns,
      getRowId: (row, _, parent) =>
        parent ? [parent.id, row.id].join(".") : row.id,
      getCoreRowModel: getCoreRowModel(),
      state: {
        columnVisibility: {
          id: false,
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const setUserAppPermissions = (old: any, current: any) => {
      setUserPermissions({
        ...userPermissions,
        [old.id]: {
          ...userPermissions[old.id],
          ...current,
        },
      });
    };

    const searchUser = useCallback(async () => {
      if (!selectedTeam || !app) {
        return;
      }
      try {
        if (!isLoading) {
          setIsLoading(true);
        }
        //search api
        const res = await API.user.getUserAppPermissionsList(app?.id);
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
              (permission) => permission.id === AppsPermission.VIEW_APP,
            )
              ? true
              : false,
            [AppsPermission.EDIT_APP]: data[ui].permissions.find(
              (permission) => permission.id === AppsPermission.EDIT_APP,
            )
              ? true
              : false,
            [AppsPermission.CREATE_APP_VERSION]: data[ui].permissions.find(
              (permission) =>
                permission.id === AppsPermission.CREATE_APP_VERSION,
            )
              ? true
              : false,
            [AppsPermission.DELETE_APP_VERSION]: data[ui].permissions.find(
              (permission) =>
                permission.id === AppsPermission.DELETE_APP_VERSION,
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
    }, [supperSearch, page, selectedTeam?.id, app]);

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
    }, [searchUser, selectedTeam?.id, app]);

    return (
      <>
        {isLoading && (
          <div className="flex w-full">
            <div className="py-12 mx-auto">
              <Loading />
            </div>
          </div>
        )}
        <div className="min-w-full overflow-auto w-80 sm:w-fit">
          {!isLoading && (
            <table className="w-full text-left rounded-md table-auto min-w-max overflow-clip">
              <thead>
                {table.getHeaderGroups().map((headerGroup, index) => (
                  <tr key={headerGroup.id + index}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        key={index}
                        className="p-4 border-b border-blue-gray-100 bg-blue-gray-50/50"
                      >
                        {header.column.id === "select" ? (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )
                        ) : (
                          <Label
                            color="blue-gray"
                            className="font-normal leading-none opacity-70"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </Label>
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
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

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
                            if (cell.column.id === "select") {
                              return;
                            }
                          }}
                          style={{
                            width: cell.column.getSize(),
                          }}
                        >
                          {cell.column.id === "select"
                            ? flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
                              )
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext(),
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
                                header.getContext(),
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
  },
);

UserAppPermissionsTable.displayName = "UserAppPermissionsTable";
export default UserAppPermissionsTable;
