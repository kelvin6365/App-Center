import { Card } from '@material-tailwind/react';
import { PropsWithChildren } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import tw from 'tailwind-styled-components';
const CustomScrollbars = tw(Scrollbars)`
  w-full
  min-h-screen
`;
const CustomPageContent = tw(Card)`
  mx-2
  md:mx-4
  my-4
  p-12
`;
const PageContent = ({ children }: PropsWithChildren) => {
  return (
    <CustomScrollbars>
      <CustomPageContent>{children}</CustomPageContent>
    </CustomScrollbars>
  );
};
export default PageContent;
