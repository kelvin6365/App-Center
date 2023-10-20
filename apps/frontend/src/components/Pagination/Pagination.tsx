import React from 'react';
import { Button, IconButton } from '@material-tailwind/react';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
type DefaultPaginationProps = {
  activePage: number;
  onPageChange: (page: number) => void;
  totalPages: number;
};
export function DefaultPagination({
  activePage = 1,
  totalPages = 1,
  onPageChange,
}: DefaultPaginationProps) {
  const [active, setActive] = React.useState(activePage);

  const getItemProps = (index: number) =>
    ({
      variant: active === index ? 'filled' : 'text',
      color: active === index ? 'blue' : 'blue-gray',
      onClick: () => {
        setActive(index);
        onPageChange(index);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

  const next = () => {
    if (active === 5) return;

    setActive(active + 1);
    onPageChange(active + 1);
  };

  const prev = () => {
    if (active === 1) return;

    setActive(active - 1);
    onPageChange(active - 1);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="w-4 h-4" />{' '}
        <p className="hidden md:block">Previous</p>
      </Button>
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => (
          <IconButton key={index} {...getItemProps(index + 1)}>
            {index + 1}
          </IconButton>
        ))}
      </div>
      <Button
        variant="text"
        color="blue-gray"
        className="flex items-center gap-2"
        onClick={next}
        disabled={active === totalPages}
      >
        <p className="hidden md:block">Next</p>
        <ArrowRightIcon strokeWidth={2} className="w-4 h-4" />
      </Button>
    </div>
  );
}
