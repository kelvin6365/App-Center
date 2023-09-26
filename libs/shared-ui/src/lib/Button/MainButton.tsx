import { Button, ButtonProps } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';

type Props = {
  'data-testid'?: string;
};
const StyledButton = tw(Button)`
bg-blue-500
hover:bg-blue-600
disabled:bg-blue-200
disabled:text-blue-700
`;
export const MainButton = ({
  ...props
}: Props & Omit<ButtonProps, 'variant' | 'color'>) => {
  return <StyledButton variant="filled" {...props} />;
};

export default MainButton;
