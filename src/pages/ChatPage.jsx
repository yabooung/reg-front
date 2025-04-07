import React, { useState, useEffect, useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import ChatInput from '../components/chat/ChatInput';
import MessageList from '../components/chat/MessageList';
import Header from '../components/layout/Header';
import { startConversation } from '../api/chat';

const ChatPage = () => {
  const { messages, sendMessage, loading } = useContext(ChatContext);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const initConversation = async () => {
      try {
        const conversation = await startConversation();
        setConversationId(conversation.id);
      } catch (error) {
        console.error('Failed to start conversation:', error);
      }
    };

    if (!conversationId) {
      initConversation();
    }
  }, [conversationId]);

  const handleSendMessage = async (content) => {
    if (!content.trim() || !conversationId) return;
    
    try {
      await sendMessage(content, conversationId);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-page">
      <Header />
      <div className="container">
        <div className="chat-container">
          <MessageList messages={messages} loading={loading} />
          <ChatInput onSendMessage={handleSendMessage} disabled={!conversationId || loading} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 