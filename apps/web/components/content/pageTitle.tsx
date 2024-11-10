import { Skeleton } from "@repo/ui/components/ui/skeleton";
import React from "react";

type Props = {
  title: string;
  description: string;
  isLoading?: boolean;
};

const PageTitle = ({ title, description, isLoading = false }: Props) => {
  return (
    <div className="py-2 pb-4">
      {isLoading ? (
        <>
          <Skeleton className="h-[33px] w-[250px]" />
          <Skeleton className="mt-1 h-[26px] w-[200px]" />
        </>
      ) : (
        <>
          <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900 dark:text-white">
            {title}
          </h4>
          <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700 dark:text-gray-300">
            {description}
          </p>
        </>
      )}
    </div>
  );
};

export default PageTitle;
