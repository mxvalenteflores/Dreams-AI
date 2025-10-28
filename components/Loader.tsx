
import React from 'react';

interface LoaderProps {
  text: string;
}

const Loader: React.FC<LoaderProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-4 h-4 bg-purple-400 rounded-full animate-bounce"></div>
      </div>
      <p className="mt-6 text-lg text-purple-200 font-medium">{text}</p>
    </div>
  );
};

export default Loader;
