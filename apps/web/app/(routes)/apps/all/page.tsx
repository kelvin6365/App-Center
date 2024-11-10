"use client";
import { useSearchParams, useRouter } from "next/navigation";
import CustomBreadcrumb from "@/components/breadcrumb/breadcrumb";
import PageTitle from "@/components/content/pageTitle";
import { CustomPagination } from "@/components/pagination/pagination";
import useSearchAppsQuery from "@/queries/useSearchAppsQuery";
import useTeamSelectionStore from "@/stores/useTeamSelectionStore";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import CreateAppDialog from "../../../../components/dialog/createAppDialog";
import { IoMdAdd } from "react-icons/io";
import { useDebounce } from "use-debounce";
import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import AppCard from "@/components/card/app-card";

const AllAppsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Apps");
  const { selectedTeam } = useTeamSelectionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const page = searchParams.get("page");

  const [openCreateApp, setOpenCreateApp] = useState(false);

  //Table Search / Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const parsedPage = parseInt(page as string);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      setCurrentPage(parsedPage);
    }
  }, [page]);

  const { apps, meta, refetch, isLoading } = useSearchAppsQuery({
    selectedTeam,
    page: currentPage,
    limit: itemsPerPage,
    searchQuery: debouncedSearchQuery,
  });

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      router.push(`/apps/all?page=${page}`);
    },
    [router]
  );

  useEffect(() => {
    if (debouncedSearchQuery) {
      //Update page to 1
      handlePageChange(1);
    }
  }, [debouncedSearchQuery, handlePageChange]);

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: t("Apps"),
            href: "/apps",
          },
          {
            label: t("All Apps"),
            href: "/apps/all",
          },
        ]}
      />
      <div className="flex justify-between gap-1">
        <PageTitle
          title={t("All Apps")}
          description={t("All apps can be found here")}
        />
        <Button
          className="my-auto"
          onClick={() => {
            setOpenCreateApp(true);
          }}
        >
          {/* Create App */}
          <span>{t("Create App")}</span>
          <IoMdAdd className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <div>
        <div className="flex items-center py-4">
          <Input
            placeholder={t("Filter Name or Description")}
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            className="max-w-sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 py-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5">
        {!isLoading &&
          apps.map(({ name, description, iconFileURL, id }, i) => {
            return (
              <Link key={id} href={`/apps/${id}`}>
                <AppCard
                  key={i}
                  name={name}
                  description={description}
                  icon={iconFileURL}
                />
              </Link>
            );
          })}
        {isLoading &&
          Array.from({ length: itemsPerPage }).map((_, i) => {
            return (
              <div
                key={i}
                className="aspect-[172.09/228.09] w-full h-full transition bg-gray-200 border shadow rounded-xl animate-pulse"
              ></div>
            );
          })}
      </div>
      <div className="py-2 ml-auto">
        <CustomPagination
          paginationData={{
            totalItems: meta.totalItems,
            itemCount: meta.itemCount,
            itemsPerPage: itemsPerPage,
            totalPages: meta.totalPages,
            currentPage: currentPage,
          }}
          onPageChange={handlePageChange}
        />
      </div>
      <CreateAppDialog
        title={t("Create App")}
        description={t("Create a new app")}
        onClose={(reload) => {
          if (reload) {
            refetch();
          }
          setOpenCreateApp(false);
        }}
        open={openCreateApp}
      />
    </div>
  );
};

export default AllAppsPage;
