import React, { useState, useRef } from 'react';
import MessageList from './MessageList';
import ExamplePrompts from './ExamplePrompts';
import { chatWithAI } from '../../api/chatService';
import { useSettings } from '../../context/SettingsContext';
import { SimpleQueryToggle } from '../settings';
import { Send, MessageCircle, InfoIcon, Loader2 } from 'lucide-react';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const eventSourceRef = useRef(null);
  
  // 설정 컨텍스트에서 상태 가져오기
  const { 
    useMock, 
    useSimpleQuery, 
    apiOptions, 
    useApiModel,
    useCustomPrompt
  } = useSettings();

  const handleSendMessage = async () => {
    if (message.trim() && !loading) {
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
      
      // 스트리밍 메시지 초기화
      const streamingId = Date.now() + 1;
      const newStreamingMessage = {
        id: streamingId,
        content: '',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isStreaming: true,
        metadata: {
          agents: [],
          steps: [],
          metrics: null
        }
      };
      
      setStreamingMessage(newStreamingMessage);
      setMessages(prev => [...prev, newStreamingMessage]);
      
      try {
        // 스트리밍 이벤트 핸들러
        const handleStreamEvent = (event) => {
          console.log('Stream event:', event);
          
          switch (event.type) {
            case 'start':
              if (!sessionId && event.data.session_id) {
                setSessionId(event.data.session_id);
              }
              break;
              
            case 'analysis':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      metadata: {
                        ...msg.metadata,
                        analysis: event.data
                      }
                    }
                  : msg
              ));
              break;
              
            case 'agent_start':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      metadata: {
                        ...msg.metadata,
                        agents: [...(msg.metadata.agents || []), event.data.agent],
                        currentAgent: event.data.agent
                      }
                    }
                  : msg
              ));
              break;
              
            case 'agent_complete':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      metadata: {
                        ...msg.metadata,
                        currentAgent: null
                      }
                    }
                  : msg
              ));
              break;
              
            case 'answer':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      content: event.data.answer,
                      confidence: event.data.confidence
                    }
                  : msg
              ));
              break;
              
            case 'metrics':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      metadata: {
                        ...msg.metadata,
                        metrics: event.data
                      }
                    }
                  : msg
              ));
              break;
              
            case 'end':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      isStreaming: false
                    }
                  : msg
              ));
              setStreamingMessage(null);
              setLoading(false);
              break;
              
            case 'error':
              setMessages(prev => prev.map(msg => 
                msg.id === streamingId 
                  ? {
                      ...msg,
                      content: event.data.message || '오류가 발생했습니다.',
                      isError: true,
                      isStreaming: false
                    }
                  : msg
              ));
              setStreamingMessage(null);
              setLoading(false);
              break;
          }
        };
        
        // API 호출 옵션 구성
        const chatOptions = {
          sessionId: sessionId,
          userId: 'user_' + Date.now(), // 실제 사용자 ID로 변경 필요
          streaming: true,
          onEvent: handleStreamEvent,
          includeSteps: !useSimpleQuery,
          includeDocuments: false,
          includeMetrics: !useSimpleQuery
        };
        
        // 스트리밍 API 호출
        eventSourceRef.current = await chatWithAI(
          message, 
          chatOptions, 
          useMock
        );
        
      } catch (error) {
        console.error('API 요청 중 오류가 발생했습니다:', error);
        
        // 오류 메시지 업데이트
        setMessages(prev => prev.map(msg => 
          msg.id === streamingId 
            ? {
                ...msg,
                content: '죄송합니다, 서버 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                isError: true,
                isStreaming: false
              }
            : msg
        ));
        
        setStreamingMessage(null);
        setLoading(false);
      }
    }
  };

  // 컴포넌트 언마운트 시 EventSource 정리
  React.useEffect(() => {
    return () => {
      if (eventSourceRef.current && eventSourceRef.current.close) {
        eventSourceRef.current.close();
      }
    };
  }, []);

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
        onKeyPress={(e) => e.key === 'Enter' && !loading && handleSendMessage()}
        disabled={loading}
      />
      <button 
        onClick={handleSendMessage}
        disabled={loading}
        className={`rounded-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#10a37f] hover:bg-[#0e9270]'} text-white transition-colors ${isLarge ? 'p-3 mx-3 my-2' : 'p-2.5 mx-2'}`}
      >
        {loading ? (
          <Loader2 className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'} animate-spin`} />
        ) : (
          <Send className={`${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
        )}
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
                <MessageCircle className="h-8 w-8 text-white" />
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
                <InfoIcon className="h-5 w-5 mr-2 text-[#10a37f]" />
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
                  <span>답변이 실시간으로 스트리밍되어 빠르게 확인할 수 있습니다</span>
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
              <MessageList messages={messages} loading={loading} streamingMessage={streamingMessage} />
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
              <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium text-[#10a37f]">RegNavigator</span>
                  {sessionId && <span className="ml-2 text-gray-400">• 세션: {sessionId.slice(0, 8)}...</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;