
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-discord-background">
      <div className="relative flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-discord-accent rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-4 text-discord-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
