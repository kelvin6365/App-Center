import { Button, ButtonProps } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';

type Props = {
  'data-testid'?: string;
};
const StyledButton = tw(Button)`
bg-gradient-to-tr to-blue-600 from-blue-400
hover:to-blue-700 hover:from-blue-500
active:to-blue-800 active:from-blue-600
disabled:to-blue-300 disabled:from-blue-100 disabled:text-blue-700
`;
export const GradientButton = ({
  ...props
}: Props & Omit<ButtonProps, 'variant' | 'color'>) => {
  return <StyledButton variant="gradient" {...props} />;
};

export default GradientButton;
