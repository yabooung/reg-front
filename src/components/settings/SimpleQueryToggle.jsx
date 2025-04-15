import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SendIcon } from 'lucide-react';

const SimpleQueryToggle = ({ type = 'default' }) => {
  const { useSimpleQuery, toggleSimpleQuery } = useSettings();

  if (type === 'icon') {
    return (
      <button
        onClick={toggleSimpleQuery}
        className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
          useSimpleQuery 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        title={useSimpleQuery ? '쿼리만 전송 모드 활성화됨' : '쿼리만 전송 모드 비활성화됨'}
      >
        <SendIcon className="w-4 h-4 mr-1.5" />
        쿼리만 전송
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleSimpleQuery}
        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 ${
          useSimpleQuery ? 'border-blue-600 bg-blue-100' : 'border-gray-300 bg-gray-100'
        } transition-colors duration-200 ease-in-out focus:outline-none`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full ${
            useSimpleQuery ? 'translate-x-5 bg-blue-600' : 'translate-x-0 bg-gray-400'
          } transition duration-200 ease-in-out`}
        />
      </button>
      <span className="text-sm text-gray-700">쿼리만 전송</span>
    </div>
  );
};

export default SimpleQueryToggle; 