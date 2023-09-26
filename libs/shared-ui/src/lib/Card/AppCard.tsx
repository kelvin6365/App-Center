import { Card } from '@material-tailwind/react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
type Props = {
  name: string;
  description: string;
  icon: string;
};

export const AppCard = ({ name, description, icon }: Props) => {
  return (
    <div className="cursor-pointer group">
      <Card className="m-3 transition group-hover:scale-110">
        <LazyLoadImage
          className="h-auto max-w-full rounded-lg aspect-[1]"
          alt={name}
          placeholder={
            <div className="h-auto max-w-full rounded-lg aspect-[1] animate-pulse bg-blue-gray-200/30"></div>
          }
          effect="opacity"
          width={'100%'}
          src={icon} // use normal <img> attributes as props
        />
      </Card>
      <div className="py-2 text-center">
        <h3 className="text-base">{name}</h3>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
};

export default AppCard;
