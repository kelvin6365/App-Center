import React from 'react';

type Props = {
  title: string;
  description: string;
};

const PageTitle = ({ title, description }: Props) => {
  return (
    <div className="py-2 pb-4">
      <h4 className="block font-sans text-2xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
        {title}
      </h4>
      <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
        {description}
      </p>
    </div>
  );
};

export default PageTitle;
