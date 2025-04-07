import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import SidebarHeader from './SidebarHeader';
import NewChatButton from './NewChatButton';
import ChatList from './ChatList';
import SidebarFooter from './SidebarFooter';

export default function Sidebar() {
    return (
        <aside className="w-64 h-full bg-zinc-900 text-white flex flex-col border-r border-zinc-800">
          <SidebarHeader />
          <NewChatButton />
          <ChatList />
          <SidebarFooter />
        </aside>
      );
    }