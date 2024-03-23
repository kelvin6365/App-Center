import React from 'react';

const Loading = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="w-16 h-16 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
