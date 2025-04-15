import React, { useState } from 'react';
import MessageList from './MessageList';
import ExamplePrompts from './ExamplePrompts';
import { chatWithAI } from '../../api/chatService';
import { useSettings } from '../../context/SettingsContext';
import { SimpleQueryToggle } from '../settings';
import { Send, MessageCircle, InfoIcon } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 설정 컨텍스트에서 상태 가져오기
  const { 
    useMock, 
    useSimpleQuery, 
    apiOptions, 
    toggleMockMode,
    useApiModel,
    useCustomPrompt
  } = useSettings();

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
        // API 호출 옵션 구성
        let chatOptions = useSimpleQuery ? {} : {
          ...apiOptions,
          useApiModel,  // API 모델 사용 여부
          useCustomPrompt,  // 커스텀 프롬프트 사용 여부
          useSimpleQuery  // 단순 쿼리 모드 여부
        };
        
        // API 호출
        const response = await chatWithAI(
          message, 
          chatOptions, 
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
        <Send className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full relative bg-[#f3f3f3]">
      {messages.length === 0 ? (
        // 대화가 없을 때의 초기 화면
        <div className="flex flex-col h-full justify-center px-4">
          <div className="max-w-2xl mx-auto w-full">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center bg-[#10a37f] rounded-full p-2 mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
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
                <InfoIcon className="h-5 w-5 mr-2 text-[#10a37f]" />
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
                  <span>상단 네비게이션 바의 API 설정 버튼으로 응답의 정확성과 길이를 조절할 수 있습니다</span>
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
                  <div className="ml-3">
                    <SimpleQueryToggle type="switch" />
                  </div>
                </div>
                <div className="flex items-center">
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