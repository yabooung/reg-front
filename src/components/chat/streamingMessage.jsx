import React from 'react';
import { Loader2, Check, Clock, FileSearch, Brain } from 'lucide-react';

const StreamingMessage = ({ message }) => {
  const { content, metadata, isStreaming, confidence } = message;
  
  // 에이전트 아이콘 매핑
  const getAgentIcon = (agent) => {
    switch (agent) {
      case 'search':
        return <FileSearch className="w-4 h-4" />;
      case 'analysis':
        return <Brain className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex items-start justify-start">
        {/* AI 프로필 아이콘 */}
        <div className="w-8 h-8 rounded-sm bg-[#10a37f] flex items-center justify-center text-white font-bold mr-4 flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white w-5 h-5">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        {/* 메시지 내용 */}
        <div className="max-w-[85%]">
          {/* 스트리밍 상태 표시 */}
          {isStreaming && metadata && (
            <div className="mb-3 space-y-2">
              {/* 분석 상태 */}
              {metadata.analysis && (
                <div className="flex items-center text-sm text-gray-600 bg-gray-50 rounded px-3 py-1.5">
                  <Brain className="w-4 h-4 mr-2 text-[#10a37f]" />
                  <span>쿼리 복잡도: {metadata.analysis.complexity}</span>
                </div>
              )}
              
              {/* 현재 실행 중인 에이전트 */}
              {metadata.currentAgent && (
                <div className="flex items-center text-sm text-blue-600 bg-blue-50 rounded px-3 py-1.5">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>{metadata.currentAgent} 에이전트 실행 중...</span>
                </div>
              )}
              
              {/* 완료된 에이전트 목록 */}
              {metadata.agents && metadata.agents.length > 0 && !metadata.currentAgent && (
                <div className="flex items-center gap-2">
                  {metadata.agents.map((agent, idx) => (
                    <div key={idx} className="flex items-center text-sm text-green-600 bg-green-50 rounded px-2 py-1">
                      <Check className="w-3 h-3 mr-1" />
                      <span>{agent}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* 메시지 내용 */}
          <div className={`bg-white border border-gray-200 shadow-sm py-5 px-6 rounded-lg text-base leading-relaxed ${
            content ? '' : 'min-h-[100px] flex items-center justify-center'
          }`}>
            {content ? (
              <div className="whitespace-pre-line">
                {content.split('\n').map((paragraph, i) => (
                  paragraph.trim() ? <p key={i} className="mb-3 last:mb-0">{paragraph}</p> : null
                ))}
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>응답 생성 중...</span>
              </div>
            )}
          </div>
          
          {/* 신뢰도 및 메트릭 표시 */}
          {!isStreaming && (confidence || metadata?.metrics) && (
            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
              {confidence && (
                <div className="flex items-center">
                  <span>신뢰도: {(confidence * 100).toFixed(1)}%</span>
                </div>
              )}
              {metadata?.metrics && (
                <>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{metadata.metrics.total_time}ms</span>
                  </div>
                  <div className="flex items-center">
                    <FileSearch className="w-3 h-3 mr-1" />
                    <span>{metadata.metrics.documents_found}개 문서</span>
                  </div>
                </>
              )}
            </div>
          )}
          
          {/* 타임스탬프 */}
          <div className="text-xs text-gray-400 mt-2">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingMessage;