import { createContext, useState, useCallback } from 'react';
// import { getMessages, sendMessage } from '../api/chat';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);

  // 더미 데이터로 메시지 목록 불러오기
  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // 테스트용 더미 데이터
    const dummyMessages = [];
    
    setTimeout(() => {
      setMessages(dummyMessages);
      setLoading(false);
    }, 500);
    
    return dummyMessages;
  }, []);

  // 더미 데이터로 새 메시지 전송
  const handleSendMessage = useCallback(async (content) => {
    setLoading(true);
    setError(null);
    
    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // 봇 응답 시뮬레이션 (1초 후)
    setTimeout(() => {
      const botMessage = {
        id: (Date.now() + 1).toString(),
        content: `"${content}"에 대한 법률 답변입니다. 이것은 테스트 응답입니다.`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setLoading(false);
    }, 1000);
    
    return userMessage;
  }, []);

  // 대화 기록 초기화
  const clearConversation = useCallback(() => {
    setMessages([]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        loading,
        error,
        chatHistory,
        fetchMessages,
        sendMessage: handleSendMessage,
        clearConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}; 