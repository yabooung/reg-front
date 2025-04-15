import React, { useState } from 'react';
import { ApiSettingsPanel, MockModeToggle, NavSimpleQueryToggle } from '../settings';
import { useSettings } from '../../context/SettingsContext';
import { Settings, LayoutGrid, HelpCircle } from 'lucide-react';

const Nav = ({ onOpenUnifiedSettings }) => {
  const [showApiSettings, setShowApiSettings] = useState(false);
  const { 
    useMock, 
    toggleMockMode, 
    resetApiOptions
  } = useSettings();
  
  // API 설정 패널 토글 함수
  const toggleApiSettings = () => {
    setShowApiSettings(prev => !prev);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 h-14 flex items-center px-6 flex-shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <div className="font-bold text-xl text-blue-600">규제 정보 검색</div>
          </div>
          <div className="flex items-center space-x-4">
            <NavSimpleQueryToggle />
            
            <button
              onClick={toggleApiSettings}
              className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center"
            >
              <Settings className="h-4 w-4 mr-1" />
              API 설정
            </button>
            
            <MockModeToggle useMock={useMock} toggleMockMode={toggleMockMode} type="icon" />
            
            {onOpenUnifiedSettings && (
              <button
                onClick={onOpenUnifiedSettings}
                className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center"
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                통합 설정
              </button>
            )}
            
            <button className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              도움말
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span className="text-sm font-semibold">U</span>
            </div>
          </div>
        </div>
      </nav>
      
      {/* API 설정 패널 */}
      <ApiSettingsPanel 
        onReset={resetApiOptions}
        onClose={toggleApiSettings}
        isOpen={showApiSettings}
      />
    </>
  );
};

export default Nav; 