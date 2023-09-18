import { useEffect } from 'react';

// type Props = {};

const General = () => {
  useEffect(() => {
    console.log('General');
  }, []);
  return <div>General</div>;
};

export default General;
