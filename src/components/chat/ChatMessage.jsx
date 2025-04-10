import React from 'react';

const ChatMessage = ({ message, isUser }) => {
  const { content, timestamp } = message;
  
  return (
    <div className={`w-full ${isUser ? '' : ''}`}>
      <div className={`flex items-start ${isUser ? 'justify-end' : 'justify-start'}`}>
        {/* AI 프로필 아이콘 */}
        {!isUser && (
          <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-5 h-5">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        
        {/* 메시지 내용 */}
        <div className={`${isUser ? 'max-w-[75%]' : 'max-w-[80%]'}`}>
          <div className={`${
            isUser 
              ? 'bg-blue-50 text-gray-800 py-3 px-4 rounded-lg shadow-sm inline-block ml-auto' 
              : 'text-gray-800'
            } text-base leading-relaxed ${isUser ? 'text-right' : ''}`}
          >
            {content}
          </div>
          {timestamp && (
            <div className={`text-xs text-gray-400 mt-2 ${isUser ? 'text-right' : ''}`}>
              {new Date(timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          )}
        </div>
        
        {/* 사용자 아이콘 */}
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold ml-4 flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 