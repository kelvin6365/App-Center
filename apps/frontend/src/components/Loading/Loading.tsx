import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isChildNull } from '../../app/util/util';
import { Spinner } from '@material-tailwind/react';
import tw from 'tailwind-styled-components';
const CustomSpin = tw(Spinner)`
    h-8
    w-8
`;
const CenterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  .ant-spin-spinning {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const Loading = ({ children }: { children?: React.ReactNode }) => {
  if (isChildNull(children)) {
    return (
      <CenterWrapper>
        <CustomSpin />
      </CenterWrapper>
    );
  } else {
    return <CustomSpin>{children}</CustomSpin>;
  }
};
Loading.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
Loading.defaultProps = {};
CustomSpin.defaultProps = {
  color: 'green',
};
export default Loading;
