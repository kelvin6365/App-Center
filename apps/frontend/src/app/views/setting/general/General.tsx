import { useEffect } from 'react';

type Props = {};

const General = (props: Props) => {
  useEffect(() => {
    console.log('General');
  }, []);
  return <div>General</div>;
};

export default General;
