import React from 'react';
import './ChatMessage.css'; // 스타일 파일 생성 필요

const ChatMessage = ({ message, isUser }) => {
  const { content, timestamp } = message;
  
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        {content}
      </div>
      <div className="message-timestamp">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default ChatMessage; 