import { Chip, ChipProps } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';

const StyledTag = tw(Chip)``;
export const Tag = ({
  onClick,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
ChipProps & React.RefAttributes<HTMLDivElement> & { onClick?: any }) => {
  return (
    <div onClick={onClick}>
      <StyledTag color="cyan" {...props} />
    </div>
  );
};
export default Tag;
