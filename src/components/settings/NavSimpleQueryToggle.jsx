import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { SendIcon } from 'lucide-react';

const NavSimpleQueryToggle = () => {
  const { useSimpleQuery, toggleSimpleQuery } = useSettings();

  return (
    <button
      onClick={toggleSimpleQuery}
      className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-colors ${
        useSimpleQuery 
          ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
      title={useSimpleQuery ? '쿼리만 전송 모드 활성화됨' : '쿼리만 전송 모드 비활성화됨'}
    >
      <SendIcon className="w-4 h-4 mr-1.5" />
      {useSimpleQuery ? '쿼리만 전송 중' : '쿼리만 전송'}
    </button>
  );
};

export default NavSimpleQueryToggle; 