import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Chat from '../components/chat/Chat';
import Nav from '../components/layout/Nav';
import { UnifiedSettings } from '../components/settings';
import { useSettings } from '../context/SettingsContext';

const LayoutTest = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { unifiedSettings, saveUnifiedSettings } = useSettings();

  const handleChatSelect = (chatId) => {
    console.log('Layout: Selected chat:', chatId);
    // 실제로는 여기서 선택된 채팅 내용을 불러오는 등의 작업을 할 수 있음
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f3f3f3] text-black">
      {/* 사이드바 */}
      <div className="w-64 h-full flex-shrink-0">
        <Sidebar onChatSelect={handleChatSelect} />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 상단 네비게이션 바 */}
        <Nav 
          onOpenUnifiedSettings={() => setShowSettings(true)}
        />
        
        {/* 채팅 영역 */}
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </div>

      {/* 통합 설정 모달 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <UnifiedSettings 
            onClose={() => setShowSettings(false)} 
            onSave={(newSettings) => {
              saveUnifiedSettings(newSettings);
              setShowSettings(false);
            }}
            initialSettings={unifiedSettings}
          />
        </div>
      )}
    </div>
  );
};

export default LayoutTest; 