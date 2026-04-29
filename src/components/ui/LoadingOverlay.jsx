import React from 'react';
import Spinner from './Spinner';

const LoadingOverlay = ({ message = 'Loading...', size = 'lg' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center space-y-4">
        <Spinner size={size} color="blue" />
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
