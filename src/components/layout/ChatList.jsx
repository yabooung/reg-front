import React from 'react';

const ChatList = ({ chats, activeChat, onChatClick, onChatSelect }) => {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onChatClick ? onChatClick(chat) : onChatSelect(chat.id)}
          className={`
            flex items-center gap-2 rounded-lg px-3 py-2 text-base w-full
            transition-colors duration-200
            ${
              activeChat?.id === chat.id
              ? 'bg-gray-200 text-gray-900'
              : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="truncate">{chat.title}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatList;
