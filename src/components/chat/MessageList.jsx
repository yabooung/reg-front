import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import './MessageList.css';

const MessageList = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="empty-messages">
          <div className="welcome-message">
            <h2>법률 챗봇에 오신 것을 환영합니다</h2>
            <p>법률 관련 질문을 입력해 주세요.</p>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            isUser={message.sender === 'user'}
          />
        ))
      )}
      
      {loading && <TypingIndicator />}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 