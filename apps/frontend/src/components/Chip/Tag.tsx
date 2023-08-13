import { Chip, ChipProps } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';

const StyledTag = tw(Chip)``;
const Tag = ({
  onClick,
  ...props
}: ChipProps & React.RefAttributes<HTMLDivElement> & { onClick?: any }) => {
  return (
    <div onClick={onClick}>
      <StyledTag color="cyan" {...props} />
    </div>
  );
};
export default Tag;
