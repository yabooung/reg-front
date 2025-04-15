import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Send, Zap } from 'lucide-react';

const SimpleQueryToggle = () => {
  const { 
    useSimpleQuery, 
    toggleSimpleQuery
  } = useSettings();

  const handleToggleSimpleQuery = () => {
    toggleSimpleQuery();
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 h-10">
      <div className="flex-shrink-0 w-10">
        <button
          onClick={handleToggleSimpleQuery}
          className="relative inline-flex items-center h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
          style={{ backgroundColor: useSimpleQuery ? '#10a37f' : '#e5e7eb' }}
        >
          <span className="absolute left-0.5 flex items-center justify-center z-10">
            <Send size={8} className={`text-white transition-opacity duration-200 ${useSimpleQuery ? 'opacity-100' : 'opacity-0'}`} />
          </span>
          
          <span className="absolute right-0.5 flex items-center justify-center z-10">
            <Zap size={8} className={`text-gray-600 transition-opacity duration-200 ${useSimpleQuery ? 'opacity-0' : 'opacity-100'}`} />
          </span>
          
          <span
            className="pointer-events-none absolute top-0.5 left-0.5 h-3.5 w-3.5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
            style={{ transform: useSimpleQuery ? 'translateX(16px)' : 'translateX(0)' }}
          />
        </button>
      </div>
      <div className="flex-grow">
        <span className="text-sm text-gray-700 whitespace-nowrap">
          {useSimpleQuery ? '쿼리만 전송' : '모든 기능 사용'}
        </span>
      </div>
    </div>
  );
};

export default SimpleQueryToggle; 