import { Button, ButtonProps } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';

type Props = {
  'data-testid'?: string;
};
const StyledButton = tw(Button)`
border-blue-700
text-blue-700
hover:bg-blue-50
hover:text-blue-700
hover:opacity-100
`;
export const OutlinedButton = ({
  ...props
}: Props & Omit<ButtonProps, 'variant' | 'color'>) => {
  return <StyledButton variant="outlined" {...props} />;
};

export default OutlinedButton;
