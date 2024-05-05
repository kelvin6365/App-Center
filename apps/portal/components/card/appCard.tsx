import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@app-center/shadcn/ui';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
type Props = {
  name: string;
  description: string;
  icon: string;
};

const appCard = ({ name, description, icon }: Props) => {
  return (
    <Card className="transition cursor-pointer group hover:scale-110 aspect-[172.09/228.09]">
      <CardContent className="p-4 pb-1">
        <div className="">
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
        </div>
      </CardContent>
      <CardHeader className="p-4 pt-1 text-center">
        <CardTitle className="text-2xl sm:text-xl">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default appCard;
