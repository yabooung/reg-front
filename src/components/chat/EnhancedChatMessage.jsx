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
  
  // JSON 응답 렌더링
  const renderJsonResponse = () => {
    const { data } = parsedContent;
    
    // 중요: 'thinking_process'를 표시하지 않습니다.
    // 사용자에게는 최종 결과만 보여주고 내부 프로세스는 숨깁니다.
    
    return (
      <div className="prose max-w-none">
        {/* 질문 세부 분석 - 메인 콘텐츠로 표시 */}
        {data.question_breakdown && data.question_breakdown.length > 0 && (
          <div className="space-y-5 mb-6">
            {data.question_breakdown.map((item, index) => (
              <div key={index} className="pb-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {item.answer.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? <p key={i} className="mb-3">{paragraph}</p> : null
                  ))}
                </div>
                {item.legal_basis && (
                  <div className="text-sm text-gray-500 mt-3 pt-2 border-t border-gray-100">
                    <span className="font-medium">근거:</span> {item.legal_basis}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* 최종 답변 - 개별 답변 다음에 표시 */}
        {data.final_answer && (
          <div className="mt-6 mb-6 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">종합 답변</h3>
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 shadow-sm">
              {data.final_answer.split('\n').map((paragraph, i) => (
                paragraph.trim() ? <p key={i} className="mb-3 last:mb-0 text-gray-800 leading-relaxed">{paragraph}</p> : null
              ))}
            </div>
          </div>
        )}
        
        {/* 참조 정보 섹션 - 접을 수 있는 콜랩스 처리 */}
        {((data.referenced_laws && data.referenced_laws.length > 0) || 
          (data.legal_terms_explained && Object.keys(data.legal_terms_explained).length > 0)) && (
          <details className="mt-5 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
            <summary className="p-4 font-medium text-blue-600 cursor-pointer flex items-center">
              <span>관련 참조 정보</span>
              <span className="ml-2 text-xs text-gray-500">
                (법률 {data.referenced_laws?.length || 0}개, 용어 {Object.keys(data.legal_terms_explained || {}).length}개)
              </span>
            </summary>
            
            <div className="px-5 pb-5 pt-2">
              {/* 관련 법률 */}
              {data.referenced_laws && data.referenced_laws.length > 0 && (
                <div className="mb-5">
                  <h4 className="font-medium text-gray-700 mb-3">참조 법률</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    {data.referenced_laws.map((law, index) => (
                      <li key={index} className="text-gray-600">{law}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 법률 용어 설명 */}
              {data.legal_terms_explained && Object.keys(data.legal_terms_explained).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">법률 용어 설명</h4>
                  <dl className="space-y-3">
                    {Object.entries(data.legal_terms_explained).map(([term, definition], index) => (
                      <div key={index} className="mb-2 pb-2 border-b border-gray-100 last:border-0">
                        <dt className="font-medium text-gray-700">{term}</dt>
                        <dd className="text-gray-600 pl-4 mt-1">{definition}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </details>
        )}
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
        <div className={`${isUser ? 'max-w-[75%]' : 'max-w-[85%]'}`}>
          <div className={`${
            isUser 
              ? 'bg-blue-50 text-gray-800 py-3 px-4 rounded-lg shadow-sm' 
              : 'bg-white border border-gray-200 shadow-sm py-5 px-6 rounded-lg'
            } text-base leading-relaxed`}
          >
            {parsedContent.isJson 
              ? renderJsonResponse() 
              : <div className="whitespace-pre-line">
                  {content.split('\n').map((paragraph, i) => (
                    paragraph.trim() ? <p key={i} className="mb-3 last:mb-0">{paragraph}</p> : null
                  ))}
                </div>
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