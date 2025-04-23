import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gradient-to-br from-green-600 to-green-900 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-200 border-opacity-50"></div>
    </div>
  );
};

export default LoadingScreen;
