
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-white font-medium tracking-wide">Processing...</p>
    </div>
  );
};

export default Loader;
