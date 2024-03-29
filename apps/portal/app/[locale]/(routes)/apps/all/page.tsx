'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomBreadcrumb from '@/components/breadcrumb/breadcrumb';
import AppCard from '@/components/card/appCard';
import PageTitle from '@/components/content/pageTitle';
import { CustomPagination } from '@/components/pagination/pagination';
import useSearchAppsQuery from '@/queries/useSearchAppsQuery';
import useTeamSelectionStore from '@/stores/useTeamSelectionStore';
import { useEffect, useState } from 'react';
const AllAppsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedTeam } = useTeamSelectionStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const page = searchParams.get('page');
  useEffect(() => {
    const parsedPage = parseInt(page as string);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      setCurrentPage(parsedPage);
    }
  }, [page]);

  const { apps, meta, isLoading, isError, error, refetch } = useSearchAppsQuery(
    {
      selectedTeam,
      page: currentPage,
      limit: itemsPerPage,
    }
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    router.push(`/apps/all?page=${page}`);
  };

  return (
    <div>
      <CustomBreadcrumb
        items={[
          {
            label: 'Apps',
            href: '/apps',
          },
          {
            label: 'All Apps',
            href: '/apps/all',
          },
        ]}
      />
      <PageTitle title="All Apps" description="All apps can be found here." />

      <div className="grid grid-cols-2 gap-8 py-2 md:grid-cols-4 lg:grid-cols-5">
        {apps.map(({ name, description, iconFileURL, id }, i) => {
          return (
            <AppCard
              key={i}
              name={name}
              description={description}
              icon={iconFileURL}
            />
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
    </div>
  );
};

export default AllAppsPage;
