import React, { useState } from 'react';
import MessageList from './MessageList';
import ExamplePrompts from './ExamplePrompts';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
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
      
      // 실제로는 여기서 API 호출을 하고 응답을 받아옴
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          content: '2023년 금융 규제의 주요 변경사항은 다음과 같습니다: 자본시장법 개정안 시행 (2023.04), 금융소비자보호법 시행령 일부 개정 (2023.06), 디지털 자산 기본법 제정 (2023.08)',
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botResponse]);
        setLoading(false);
      }, 1500);
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
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
                  <span>처음 질문 후에 후속 질문도 자유롭게 가능합니다</span>
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
              <div className="text-xs text-gray-500 text-center mt-2">
                <span className="font-medium text-[#10a37f]">Reg Navigator</span> - 규제 정보 검색 및 분석 AI
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat; 