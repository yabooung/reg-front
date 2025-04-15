import React, { useState } from 'react';

const UnifiedSettings = ({ onClose, onSave, initialSettings = {} }) => {
  const [activeTab, setActiveTab] = useState('model');
  
  // Model settings
  const [selectedModel, setSelectedModel] = useState(initialSettings.model || 'gpt-4');
  const [temperature, setTemperature] = useState(initialSettings.temperature || 0.7);
  const [maxTokens, setMaxTokens] = useState(initialSettings.maxTokens || 2000);
  
  // API settings
  const [enableClassification, setEnableClassification] = useState(
    initialSettings.enableClassification !== undefined ? initialSettings.enableClassification : true
  );
  const [enableAmplification, setEnableAmplification] = useState(
    initialSettings.enableAmplification !== undefined ? initialSettings.enableAmplification : true
  );
  const [enableValidation, setEnableValidation] = useState(
    initialSettings.enableValidation !== undefined ? initialSettings.enableValidation : false
  );
  const [topK, setTopK] = useState(initialSettings.topK || 5);
  const [collectionName, setCollectionName] = useState(initialSettings.collectionName || 'regulations');
  
  // Prompt settings
  const [promptActiveTab, setPromptActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState(initialSettings.promptTemplate || 'default');
  const [customPrompt, setCustomPrompt] = useState(initialSettings.customPrompt || '');
  
  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: '가장 강력한 모델로 복잡한 규제 분석에 적합' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '빠른 응답과 간단한 규제 검색에 적합' },
    { id: 'legal-gpt', name: 'Legal GPT (Beta)', description: '법적 규제에 특화된 모델' },
  ];
  
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
  
  const collections = [
    { id: 'regulations', name: '일반 규제' },
    { id: 'financial_regulations', name: '금융 규제' },
    { id: 'environmental_laws', name: '환경법' },
    { id: 'labor_laws', name: '노동법' },
  ];

  const handleSave = () => {
    if (onSave) {
      // 프롬프트 데이터 준비
      const promptData = promptActiveTab === 'templates' 
        ? promptTemplates.find(t => t.id === selectedTemplate) 
        : { id: 'custom', name: '사용자 정의', prompt: customPrompt };
        
      onSave({
        // 모델 설정
        model: selectedModel,
        temperature,
        maxTokens,
        
        // API 설정
        enableClassification,
        enableAmplification,
        enableValidation,
        topK,
        collectionName,
        
        // 프롬프트 설정
        promptTemplate: promptData.id,
        promptName: promptData.name,
        prompt: promptData.prompt
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">API 및 모델 설정</h2>
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
      
      {/* Main Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'model'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('model')}
          >
            모델 설정
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'api'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('api')}
          >
            API 설정
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'prompt'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('prompt')}
          >
            프롬프트 설정
          </button>
        </div>
      </div>
      
      {/* Model Settings Tab */}
      {activeTab === 'model' && (
        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">AI 모델 선택</label>
            <div className="space-y-3">
              {models.map(model => (
                <div 
                  key={model.id}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedModel === model.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                      selectedModel === model.id 
                        ? 'bg-blue-500' 
                        : 'border border-gray-300'
                    }`}></div>
                    <div>
                      <div className="font-medium">{model.name}</div>
                      <div className="text-sm text-gray-500">{model.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Temperature: {temperature.toFixed(1)}
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">정확함</span>
              <input 
                type="range" 
                min="0" 
                max="2" 
                step="0.1" 
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-gray-500 text-sm">창의성</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              낮은 값은 더 결정적인 응답을, 높은 값은 더 다양한 응답을 생성합니다.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              최대 토큰 수: {maxTokens}
            </label>
            <input 
              type="range" 
              min="500" 
              max="8000" 
              step="100" 
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              응답 생성에 사용할 최대 토큰 수를 설정합니다. (약 750단어 = 1000토큰)
            </p>
          </div>
        </div>
      )}
      
      {/* API Settings Tab */}
      {activeTab === 'api' && (
        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">데이터 컬렉션</label>
            <select 
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              검색에 사용할 벡터 데이터베이스 컬렉션을 선택합니다.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">검색 결과 수 (Top K): {topK}</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={topK}
              onChange={(e) => setTopK(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              질의에 대해 반환할 최대 문서 수를 설정합니다.
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">프로세싱 단계 활성화</label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableClassification"
                  checked={enableClassification}
                  onChange={(e) => setEnableClassification(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableClassification" className="ml-2 text-gray-700">
                  질문 분류 (Classification)
                </label>
                <span className="ml-auto text-xs text-gray-500">
                  질문의 유형과 카테고리를 분석합니다
                </span>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableAmplification"
                  checked={enableAmplification}
                  onChange={(e) => setEnableAmplification(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableAmplification" className="ml-2 text-gray-700">
                  질문 증폭 (Amplification)
                </label>
                <span className="ml-auto text-xs text-gray-500">
                  검색 품질을 높이기 위해 질문을 확장합니다
                </span>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableValidation"
                  checked={enableValidation}
                  onChange={(e) => setEnableValidation(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="enableValidation" className="ml-2 text-gray-700">
                  응답 검증 (Validation)
                </label>
                <span className="ml-auto text-xs text-gray-500">
                  생성된 응답의 정확성을 검증합니다
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Prompt Settings Tab */}
      {activeTab === 'prompt' && (
        <div>
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <button
                className={`py-2 px-4 font-medium ${
                  promptActiveTab === 'templates'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setPromptActiveTab('templates')}
              >
                템플릿
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  promptActiveTab === 'custom'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setPromptActiveTab('custom')}
              >
                사용자 정의
              </button>
            </div>
          </div>

          {promptActiveTab === 'templates' ? (
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
        </div>
      )}
      
      <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
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
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default UnifiedSettings; 