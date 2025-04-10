import React, { useState } from 'react';

const PromptSettings = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [customPrompt, setCustomPrompt] = useState('');
  
  const promptTemplates = [
    { 
      id: 'default', 
      name: '기본 규제 검색', 
      description: '일반적인 규제 정보 검색 및 해석을 위한 프롬프트',
      prompt: '주어진 규제 관련 질문에 대해 명확하고 정확하게 응답해주세요. 관련 법규와 제정/개정 날짜를 포함시키고, 필요한 경우 실제 적용 사례를 설명해주세요.'
    },
    { 
      id: 'legal-analysis', 
      name: '법적 분석', 
      description: '규제의 법적 측면을 깊이 분석하는 프롬프트',
      prompt: '다음 질문에 대해 법적 관점에서 자세히 분석해주세요. 관련 법조항, 판례, 해석 지침을 포함하고, 다양한 법적 해석 가능성과 리스크를 설명해주세요.'
    },
    { 
      id: 'compliance', 
      name: '컴플라이언스 체크', 
      description: '기업의 규제 준수 여부를 확인하는 프롬프트',
      prompt: '다음 상황이 관련 규제를 준수하는지 평가해주세요. 준수해야 할 핵심 규제를 나열하고, 각 항목별로 준수 여부와 개선 필요 사항을 설명해주세요. 위반 시 발생할 수 있는 페널티도 명시해주세요.'
    },
  ];

  const handleSave = () => {
    const promptData = activeTab === 'templates' 
      ? promptTemplates.find(t => t.id === selectedTemplate) 
      : { id: 'custom', name: '사용자 정의', prompt: customPrompt };
      
    if (onSave && promptData) {
      onSave(promptData);
    }
    
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">프롬프트 설정</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('templates')}
          >
            템플릿
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'custom'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('custom')}
          >
            사용자 정의
          </button>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <div className="space-y-4">
          {promptTemplates.map(template => (
            <div 
              key={template.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedTemplate === template.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <div className="flex items-start">
                <div className={`w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0 ${
                  selectedTemplate === template.id 
                    ? 'bg-blue-500' 
                    : 'border border-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-sm text-gray-500 mb-2">{template.description}</div>
                  {selectedTemplate === template.id && (
                    <div className="bg-gray-100 p-3 rounded-md text-sm border border-gray-200 mt-2">
                      {template.prompt}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <label className="block text-gray-700 font-semibold mb-2">사용자 정의 프롬프트</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="AI에게 전달할 프롬프트 지침을 입력하세요..."
            className="w-full min-h-[200px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-2">
            프롬프트는 AI 응답의 품질과 방향성을 결정합니다. 구체적인 지침과 원하는 결과물의 형식을 명확하게 작성하세요.
          </p>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default PromptSettings; 