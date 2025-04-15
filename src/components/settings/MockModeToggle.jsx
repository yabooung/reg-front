import React from 'react';
import { Cpu, Database } from 'lucide-react';

const MockModeToggle = ({ useMock, toggleMockMode, type = 'button' }) => {
  if (type === 'icon') {
    return (
      <button 
        onClick={toggleMockMode}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          useMock 
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
            : 'bg-green-100 text-green-800 hover:bg-green-200'
        }`}
      >
        {useMock ? (
          <Cpu className="w-4 h-4 mr-1.5" />
        ) : (
          <Database className="w-4 h-4 mr-1.5" />
        )}
        <span>{useMock ? '목업 모드' : '실제 API 모드'}</span>
      </button>
    );
  }
  
  if (type === 'switch') {
    return (
      <div className="flex items-center">
        <span className="flex items-center">
          {useMock ? (
            <Cpu className="w-4 h-4 mr-1 text-amber-500" />
          ) : (
            <Database className="w-4 h-4 mr-1 text-green-500" />
          )}
          {useMock ? '목업 응답 모드' : '실제 API 모드'}
        </span>
        <div className="ml-2">
          <button
            onClick={toggleMockMode}
            className={`relative inline-flex h-4 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 ${
              useMock ? 'border-amber-500 bg-amber-100' : 'border-green-500 bg-green-100'
            } transition-colors duration-200 ease-in-out focus:outline-none`}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full ${
                useMock ? 'translate-x-4 bg-amber-500' : 'translate-x-0 bg-green-500'
              } transition duration-200 ease-in-out`}
            />
          </button>
        </div>
      </div>
    );
  }
  
  // Default button type
  return (
    <button 
      onClick={toggleMockMode}
      className={`flex items-center justify-center px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
        useMock 
          ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
          : 'bg-green-100 text-green-800 hover:bg-green-200'
      }`}
    >
      {useMock ? (
        <Cpu className="w-4 h-4 mr-1.5" />
      ) : (
        <Database className="w-4 h-4 mr-1.5" />
      )}
      {useMock ? '목업 모드' : '실제 API 모드'}
    </button>
  );
};

export default MockModeToggle; 