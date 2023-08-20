import { useParams } from 'react-router-dom';

type Props = {};

const Install = (props: Props) => {
  const { id: appVersionId } = useParams();
  return <div>Install 1 {appVersionId}</div>;
};

export default Install;
