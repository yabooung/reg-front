import React from 'react';

const EnhancedChatMessage = ({ message, isUser }) => {
  const { content, timestamp } = message;
  
  // JSON 응답 파싱 시도
  const parseContent = () => {
    if (isUser) return { isJson: false, content };

    try {
      // JSON 형식을 찾아보기 (```json ... ``` 형식)
      const jsonRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
      const match = content.match(jsonRegex);
      
      if (match && match[1]) {
        const parsedJson = JSON.parse(match[1]);
        return {
          isJson: true,
          data: parsedJson,
          // JSON 블록 외의 텍스트를 저장
          plainText: content.replace(jsonRegex, '').trim()
        };
      }
      
      // 일반 JSON 문자열인지 확인
      try {
        const parsedJson = JSON.parse(content);
        return { isJson: true, data: parsedJson, plainText: '' };
      } catch {
        // 이 형식이 아니면 일반 텍스트로 처리
        return { isJson: false, content };
      }
    } catch (error) {
      console.error('JSON 파싱 오류:', error);
      return { isJson: false, content };
    }
  };

  const parsedContent = parseContent();
  
  // 법률 참조 렌더링
  const renderReferencedLaws = (laws) => {
    if (!laws || !Array.isArray(laws) || laws.length === 0) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-sm text-gray-700 mb-2">참조 법률</h4>
        <ul className="list-disc pl-5 space-y-1">
          {laws.map((law, index) => (
            <li key={index} className="text-sm text-gray-600">{law}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  // 법률 용어 설명 렌더링
  const renderLegalTerms = (terms) => {
    if (!terms || Object.keys(terms).length === 0) return null;
    
    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-sm text-gray-700 mb-2">법률 용어 설명</h4>
        <dl className="space-y-2">
          {Object.entries(terms).map(([term, definition], index) => (
            <div key={index} className="mb-2">
              <dt className="font-medium text-sm text-gray-700">{term}</dt>
              <dd className="text-sm text-gray-600 pl-4">{definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    );
  };
  
  // JSON 응답 렌더링
  const renderJsonResponse = () => {
    const { data } = parsedContent;
    
    return (
      <div className="space-y-4">
        {/* 최종 답변이 있으면 표시 */}
        {data.final_answer && (
          <div className="text-gray-800 leading-relaxed font-medium">
            {data.final_answer}
          </div>
        )}
        
        {/* 관련 법률 */}
        {renderReferencedLaws(data.referenced_laws)}
        
        {/* 관련 판례 */}
        {data.referenced_precedents && data.referenced_precedents.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-sm text-gray-700 mb-2">관련 판례</h4>
            <ul className="list-disc pl-5 space-y-1">
              {data.referenced_precedents.map((precedent, index) => (
                <li key={index} className="text-sm text-gray-600">{precedent}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 법률 용어 설명 */}
        {renderLegalTerms(data.legal_terms_explained)}
      </div>
    );
  };

  return (
    <div className="w-full">
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
              ? 'bg-blue-50 text-gray-800 py-3 px-4 rounded-lg shadow-sm' 
              : 'bg-white border border-gray-200 shadow-sm py-3 px-4 rounded-lg'
            } text-base leading-relaxed `}
          >
            {parsedContent.isJson 
              ? renderJsonResponse() 
              : content
            }
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

export default EnhancedChatMessage; 