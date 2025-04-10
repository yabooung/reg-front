import React, { useState } from 'react';
import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import ChatList from './ChatList';
import SidebarFooter from './SidebarFooter';

const Sidebar = ({ onChatSelect }) => {
  const [chats, setChats] = useState([
    { id: 1, title: '금융 규제 검색' },
    { id: 2, title: '환경 규제 분석' },
  ]);

  const handleNewChat = () => {
    const newChat = {
      id: chats.length + 1,
      title: `새 규제 검색 ${chats.length + 1}`,
    };
    setChats([newChat, ...chats]);
  };

  const handleChatSelect = (chatId) => {
    console.log('Selected chat:', chatId);
    if (onChatSelect) {
      onChatSelect(chatId);
    }
  };

  return (
    <div className="h-full bg-[#f5f5f7] flex flex-col">
      <div className="p-4 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <SidebarHeader />
        </div>
        <div className="mb-4">
          <NewChatButton onClick={handleNewChat} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pt-0">
        <div className="border-t border-gray-700 pt-4">
          <div className="text-gray-700 text-base mb-2">이전 검색 기록</div>
          <ChatList chats={chats} onChatSelect={handleChatSelect} />
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <SidebarFooter />
      </div>
    </div>
  );
};

export default Sidebar;