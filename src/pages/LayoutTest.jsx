import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Chat from '../components/chat/Chat';
import Nav from '../components/layout/Nav';
import ModelSettings from '../components/settings/ModelSettings';
import PromptSettings from '../components/settings/PromptSettings';

const LayoutTest = () => {
  const [showModelSettings, setShowModelSettings] = useState(false);
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [modelConfig, setModelConfig] = useState({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  });
  // eslint-disable-next-line no-unused-vars
  const [promptConfig, setPromptConfig] = useState({
    id: 'default',
    name: '기본 규제 검색',
    prompt: '주어진 규제 관련 질문에 대해 명확하고 정확하게 응답해주세요. 관련 법규와 제정/개정 날짜를 포함시키고, 필요한 경우 실제 적용 사례를 설명해주세요.'
  });

  const handleChatSelect = (chatId) => {
    console.log('Layout: Selected chat:', chatId);
    // 실제로는 여기서 선택된 채팅 내용을 불러오는 등의 작업을 할 수 있음
  };

  const handleSaveModelSettings = (settings) => {
    setModelConfig(settings);
    setShowModelSettings(false);
    console.log('Model settings saved:', settings);
  };

  const handleSavePromptSettings = (settings) => {
    setPromptConfig(settings);
    setShowPromptSettings(false);
    console.log('Prompt settings saved:', settings);
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
          onOpenModelSettings={() => setShowModelSettings(true)}
          onOpenPromptSettings={() => setShowPromptSettings(true)}
        />
        
        {/* 채팅 영역 */}
        <div className="flex-1 overflow-hidden">
          <Chat />
        </div>
      </div>

      {/* 모델 설정 모달 */}
      {showModelSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <ModelSettings 
            onClose={() => setShowModelSettings(false)} 
            onSave={handleSaveModelSettings}
          />
        </div>
      )}

      {/* 프롬프트 설정 모달 */}
      {showPromptSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <PromptSettings 
            onClose={() => setShowPromptSettings(false)} 
            onSave={handleSavePromptSettings}
          />
        </div>
      )}
    </div>
  );
};

export default LayoutTest; 