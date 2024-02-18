import { PropsWithChildren } from 'react';
import { ScrollArea } from '@app-center/shadcn/ui';
import tw from 'tailwind-styled-components';
const CustomScrollbars = tw(ScrollArea)`
  w-full
  h-full
`;
const CustomPageContent = tw.div`
  flex-1 space-y-4 p-4 md:p-8 pt-6
`;
const PageContent = ({ children }: PropsWithChildren) => {
  return (
    <CustomScrollbars>
      <CustomPageContent>{children}</CustomPageContent>
    </CustomScrollbars>
  );
};
export default PageContent;
