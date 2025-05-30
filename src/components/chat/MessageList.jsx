import React, { useRef, useEffect } from 'react';
import EnhancedChatMessage from './EnhancedChatMessage';
import StreamingMessage from './streamingMessage';
import TypingIndicator from './TypingIndicator';

const MessageList = ({ messages, loading, streamingMessage }) => {
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full px-4 py-6">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <div className="text-center bg-white rounded-lg shadow-md p-8 max-w-90">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">법률 챗봇에 오신 것을 환영합니다</h2>
            <p className="text-gray-600 text-lg">법률 관련 질문을 입력해 주세요.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="py-4 border-b border-gray-100 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#10a37f] rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-5 h-5">
                  <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="text-lg font-semibold text-gray-800 ml-2">규제 정보 AI 어시스턴트</h1>
            </div>
          </div>
          <div className="space-y-4">
            {messages.map((message, index) => {
              // 스트리밍 중이거나 스트리밍이 끝난 메시지인 경우 StreamingMessage 사용
              if (message.isStreaming || (message.sender === 'bot' && message.metadata)) {
                return (
                  <StreamingMessage
                    key={message.id || index}
                    message={message}
                  />
                );
              }
              // 사용자 메시지나 일반 메시지인 경우 EnhancedChatMessage 사용
              return (
                <EnhancedChatMessage
                  key={message.id || index}
                  message={message}
                  isUser={message.sender === 'user'}
                />
              );
            })}
            
            {/* Loading indicator only shows when not streaming */}
            {loading && !streamingMessage && <TypingIndicator />}
            
            <div ref={messagesEndRef} className="h-10" />
          </div>
        </>
      )}
    </div>
  );
};

export default MessageList;