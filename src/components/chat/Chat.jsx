import React, { useState } from 'react';
import MessageList from './MessageList';
import ExamplePrompts from './ExamplePrompts';
import { chatWithAI } from '../../api/chatService';
import { DEFAULT_MODEL_SETTINGS } from '../../api/apiConfig';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [useMock, setUseMock] = useState(true); // 목업 사용 여부 상태
  const [showSettings, setShowSettings] = useState(false); // 설정 패널 표시 여부
  const [useSimpleQuery, setUseSimpleQuery] = useState(false); // 쿼리만 보낼지 여부
  
  // API 옵션 상태
  const [apiOptions, setApiOptions] = useState({
    modelName: DEFAULT_MODEL_SETTINGS.modelName,
    temperature: DEFAULT_MODEL_SETTINGS.temperature,
    maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
    topK: DEFAULT_MODEL_SETTINGS.topK,
    enableClassification: true,
    enableAmplification: true,
    enableValidation: false
  });

  const handleSendMessage = async () => {
    if (message.trim()) {
      // 사용자 메시지 추가
      const userMessage = {
        id: Date.now(),
        content: message,
        sender: 'user',
        timestamp: new Date().toISOString()
      };
      
      setMessages([...messages, userMessage]);
      setMessage('');
      setLoading(true);
      
      try {
        // API 호출 - useSimpleQuery가 true면 빈 옵션 객체 전달
        const response = await chatWithAI(
          message, 
          useSimpleQuery ? {} : apiOptions, 
          useMock
        );
        
        // 응답 처리 - JSON 형식 응답이 포함된 경우 처리
        let messageContent = '';
        
        // raw_json이 있는 경우 이것을 그대로 표시 (EnhancedChatMessage가 파싱)
        if (response.raw_json) {
          messageContent = `\`\`\`json\n${response.raw_json}\n\`\`\``;
        } else {
          messageContent = response.answer || response.response || '죄송합니다, 응답을 생성하는 데 문제가 발생했습니다.';
        }
        
        const botResponse = {
          id: Date.now() + 1,
          content: messageContent,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          references: response.references || []
        };
        
        setMessages(prev => [...prev, botResponse]);
      } catch (error) {
        console.error('API 요청 중 오류가 발생했습니다:', error);
        
        // 오류 메시지 추가
        const errorMessage = {
          id: Date.now() + 1,
          content: '죄송합니다, 서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleExampleClick = (exampleText) => {
    setMessage(exampleText);
  };

  // 목업 모드 토글 함수
  const toggleMockMode = () => {
    setUseMock(prev => !prev);
  };
  
  // 설정 패널 토글 함수
  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };
  
  // 옵션 변경 핸들러
  const handleOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 입력 타입에 따라 값 처리
    const processedValue = type === 'checkbox' 
      ? checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setApiOptions(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  // 단순 쿼리 모드 토글
  const toggleSimpleQuery = () => {
    setUseSimpleQuery(prev => !prev);
  };

  const renderInput = (isLarge = false) => (
    <div className={`flex items-center bg-white rounded-xl border ${isLarge ? 'shadow-md border-gray-300' : 'shadow-sm border-gray-200'}`}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLarge ? "규제 관련 질문을 입력하세요..." : "질문을 입력하세요..."}
        className={`flex-1 bg-transparent border-0 outline-none text-gray-800 ${isLarge ? 'px-5 py-5 text-lg' : 'px-4 py-4 text-base'}`}
        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button 
        onClick={handleSendMessage}
        className={`rounded-lg bg-[#10a37f] text-white hover:bg-[#0e9270] transition-colors ${isLarge ? 'p-3 mx-3 my-2' : 'p-2.5 mx-2'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      </button>
    </div>
  );

  // 목업 모드 표시 버튼
  const renderMockToggle = () => (
    <div className="absolute top-4 right-4 z-10 flex space-x-2">
      <button 
        onClick={toggleSettings}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>API 설정</span>
      </button>
      
      <button 
        onClick={toggleMockMode}
        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
          useMock 
            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300' 
            : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${useMock ? 'bg-amber-500' : 'bg-green-500'}`}></span>
        <span>{useMock ? '목업 모드' : '실제 API 모드'}</span>
      </button>
    </div>
  );
  
  // API 설정 패널
  const renderSettingsPanel = () => (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${showSettings ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800">API 설정</h2>
        <button 
          onClick={toggleSettings}
          className="text-gray-500 hover:text-gray-700 p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="p-4 overflow-y-auto h-full pb-32">
        <div className="space-y-5">
          {/* 단순 쿼리 모드 토글 */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <label htmlFor="useSimpleQuery" className="block text-sm font-medium text-blue-800">
                쿼리만 전송 (고급 설정 없음)
              </label>
              <div className="ml-2">
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
              </div>
            </div>
            <p className="mt-1 text-xs text-blue-600">
              활성화 시 질문만 전송하고 다른 설정은 무시합니다. 서버 기본값이 사용됩니다.
            </p>
          </div>
          
          <div className={useSimpleQuery ? "opacity-50 pointer-events-none" : ""}>
            {/* 모델 선택 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">모델</label>
              <select 
                name="modelName" 
                value={apiOptions.modelName}
                onChange={handleOptionChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-turbo">GPT-4 Turbo</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              </select>
            </div>
            
            {/* Temperature 설정 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature: {apiOptions.temperature}
              </label>
              <input 
                type="range" 
                name="temperature"
                min="0" 
                max="1" 
                step="0.1"
                value={apiOptions.temperature}
                onChange={handleOptionChange}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>정확성</span>
                <span>창의성</span>
              </div>
            </div>
            
            {/* 최대 토큰 수 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                최대 토큰 수
              </label>
              <input 
                type="number" 
                name="maxTokens"
                min="100" 
                max="2000"
                step="50"
                value={apiOptions.maxTokens}
                onChange={handleOptionChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
              />
            </div>
            
            {/* 인용 문서 수 */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                인용 문서 수 (Top K)
              </label>
              <input 
                type="number" 
                name="topK"
                min="1" 
                max="20"
                value={apiOptions.topK}
                onChange={handleOptionChange}
                className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
              />
            </div>
            
            {/* 체크박스 옵션들 */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableClassification"
                  name="enableClassification"
                  checked={apiOptions.enableClassification}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                />
                <label htmlFor="enableClassification" className="ml-2 block text-sm text-gray-700">
                  질문 분류 활성화
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAmplification"
                  name="enableAmplification"
                  checked={apiOptions.enableAmplification}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                />
                <label htmlFor="enableAmplification" className="ml-2 block text-sm text-gray-700">
                  질문 확장 활성화
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableValidation"
                  name="enableValidation"
                  checked={apiOptions.enableValidation}
                  onChange={handleOptionChange}
                  className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                />
                <label htmlFor="enableValidation" className="ml-2 block text-sm text-gray-700">
                  응답 검증 활성화
                </label>
              </div>
            </div>
          </div>
          
          {/* 초기화 버튼 */}
          <div className="pt-3">
            <button
              onClick={() => {
                setApiOptions({
                  modelName: DEFAULT_MODEL_SETTINGS.modelName,
                  temperature: DEFAULT_MODEL_SETTINGS.temperature,
                  maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
                  topK: DEFAULT_MODEL_SETTINGS.topK,
                  enableClassification: true,
                  enableAmplification: true,
                  enableValidation: false
                });
                setUseSimpleQuery(false);
              }}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md border border-gray-300 transition-colors"
            >
              기본값으로 초기화
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full relative bg-[#f3f3f3]">
      {/* 목업 모드 토글 버튼과 설정 패널 버튼 */}
      {renderMockToggle()}
      
      {/* API 설정 사이드 패널 */}
      {renderSettingsPanel()}
      
      {/* 설정 패널 외부 클릭 시 닫기 */}
      {showSettings && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40" 
          onClick={toggleSettings}
        ></div>
      )}
      
      {messages.length === 0 ? (
        // 대화가 없을 때의 초기 화면
        <div className="flex flex-col h-full justify-center px-4">
          <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-[#10a37f] rounded-full p-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                규제 정보 AI 어시스턴트
              </h1>
              <p className="text-gray-600 text-lg max-w-lg mx-auto">
                규제 관련 질문을 입력하시면 신속하고 정확하게 답변해 드립니다
              </p>
            </div>
            
            {/* 입력 컴포넌트 */}
            <div className="mb-10">
              {renderInput(true)}
            </div>
            
            <div className="mb-8">
              <h2 className="text-base font-semibold text-gray-700 mb-3 text-center">다음과 같은 질문을 시도해보세요</h2>
              <ExamplePrompts onExampleClick={handleExampleClick} />
            </div>
            
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
              <div className="text-gray-700 font-medium mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#10a37f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                사용 팁
              </div>
              <div className="text-gray-600 space-y-1.5 text-sm">
                <div className="flex items-start">
                  <span className="mr-2 text-[#10a37f]">•</span>
                  <span>구체적인 질문이 효과적입니다</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-[#10a37f]">•</span>
                  <span>법률명과 시행일을 포함하여 질문하면 더 정확한 답변을 받을 수 있습니다</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2 text-[#10a37f]">•</span>
                  <span>우측 상단의 API 설정 버튼으로 응답의 정확성과 길이를 조절할 수 있습니다</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 대화가 있을 때의 화면
        <div className="flex-1 overflow-y-auto pb-32 bg-gradient-to-r from-gray-100 to-gray-200">
          <div className="px-4 max-w-4xl mx-auto w-full">
            <div className="bg-white rounded-xl overflow-hidden mt-4">
              <MessageList messages={messages} loading={loading} />
            </div>
          </div>
        </div>
      )}

      {/* 입력 영역 (대화가 있을 때만 고정) */}
      {messages.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-100 via-white to-transparent pt-5 pb-4">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3">
              {renderInput(false)}
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium text-[#10a37f]">Reg Navigator</span>
                  {useSimpleQuery && (
                    <span className="ml-2 bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-[10px]">
                      쿼리만 전송
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSettings}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>설정</span>
                  </button>
                  
                  <div className="flex items-center">
                    <span>{useMock ? '목업 응답 모드' : '실제 API 모드'}</span>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 