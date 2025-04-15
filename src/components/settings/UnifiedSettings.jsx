import React, { useState } from 'react';
import { DEFAULT_MODEL_SETTINGS } from '../../api/apiConfig';
import { useSettings } from '../../context/SettingsContext';

const UnifiedSettings = ({ onClose, onSave, initialSettings = {} }) => {
  // 설정 컨텍스트 접근
  const { useSimpleQuery } = useSettings();
  
  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState('feature');
  
  // 최종 저장될 설정값 (변경사항은 여기에 저장되지만 즉시 적용되지 않음)
  const [settings, setSettings] = useState({
    // 기능 활성화 설정
    useCustomPrompt: initialSettings.useCustomPrompt !== undefined 
      ? initialSettings.useCustomPrompt 
      : true,
    useDataCollection: initialSettings.useDataCollection !== undefined
      ? initialSettings.useDataCollection
      : true,
    
    // 데이터 컬렉션 설정
    collectionName: initialSettings.collectionName || DEFAULT_MODEL_SETTINGS.collectionName,
    topK: initialSettings.topK || DEFAULT_MODEL_SETTINGS.topK,
    
    // 프로세싱 단계 설정
    enableClassification: initialSettings.enableClassification !== undefined 
      ? initialSettings.enableClassification 
      : true,
    enableAmplification: initialSettings.enableAmplification !== undefined 
      ? initialSettings.enableAmplification 
      : true,
    enableValidation: initialSettings.enableValidation !== undefined 
      ? initialSettings.enableValidation 
      : false,
    
    // 각 단계별 모델 설정
    classification: {
      model: initialSettings.classification?.model || DEFAULT_MODEL_SETTINGS.modelName,
      temperature: initialSettings.classification?.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: initialSettings.classification?.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      prompt: initialSettings.classification?.prompt || "규제 관련 질문을 분류해주세요"
    },
    
    amplification: {
      model: initialSettings.amplification?.model || DEFAULT_MODEL_SETTINGS.modelName,
      temperature: initialSettings.amplification?.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: initialSettings.amplification?.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      prompt: initialSettings.amplification?.prompt || "사용자 질문을 더 명확하게 확장해주세요"
    },
    
    generation: {
      model: initialSettings.generation?.model || DEFAULT_MODEL_SETTINGS.modelName,
      temperature: initialSettings.generation?.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: initialSettings.generation?.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      prompt: initialSettings.generation?.prompt || "찾은 정보를 바탕으로 질문에 답변해주세요"
    },
    
    validation: {
      model: initialSettings.validation?.model || DEFAULT_MODEL_SETTINGS.modelName,
      temperature: initialSettings.validation?.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: initialSettings.validation?.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      prompt: initialSettings.validation?.prompt || "응답의 정확성을 검증해주세요"
    }
  });
  
  // 모델 목록
  const models = [
    { id: 'gpt-4o', name: 'GPT-4o', description: '가장 강력한 모델로 복잡한 규제 분석에 적합' },
    { id: 'gpt-4o-mini', name: 'GPT-4o-mini', description: '빠른 응답과 간단한 규제 검색에 적합' },
    { id: 'local-model', name: 'Local model', description: '추가 예정' },
  ];
  
  // 컬렉션 목록
  const collections = [
    { id: 'kised_regfinder_old_law_db_20241129', name: '규제검색기 DB' },
    { id: 'financial_regulations', name: '금융 규제' },
    { id: 'environmental_laws', name: '환경법' },
    { id: 'labor_laws', name: '노동법' },
  ];

  // 현재 설정 중인 처리 단계
  const [currentStep, setCurrentStep] = useState('classification');

  // 기본 설정으로 초기화
  const resetToDefaults = () => {
    setSettings({
      // 기능 활성화 설정
      useCustomPrompt: true,
      useDataCollection: true,
      
      // 데이터 컬렉션 설정
      collectionName: DEFAULT_MODEL_SETTINGS.collectionName,
      topK: DEFAULT_MODEL_SETTINGS.topK,
      
      // 프로세싱 단계 설정
      enableClassification: true,
      enableAmplification: true,
      enableValidation: false,
      
      // 각 단계별 모델 설정
      classification: {
        model: DEFAULT_MODEL_SETTINGS.modelName,
        temperature: DEFAULT_MODEL_SETTINGS.temperature,
        maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
        prompt: "규제 관련 질문을 분류해주세요"
      },
      
      amplification: {
        model: DEFAULT_MODEL_SETTINGS.modelName,
        temperature: DEFAULT_MODEL_SETTINGS.temperature,
        maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
        prompt: "사용자 질문을 더 명확하게 확장해주세요"
      },
      
      generation: {
        model: DEFAULT_MODEL_SETTINGS.modelName,
        temperature: DEFAULT_MODEL_SETTINGS.temperature,
        maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
        prompt: "찾은 정보를 바탕으로 질문에 답변해주세요"
      },
      
      validation: {
        model: DEFAULT_MODEL_SETTINGS.modelName,
        temperature: DEFAULT_MODEL_SETTINGS.temperature,
        maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
        prompt: "응답의 정확성을 검증해주세요"
      }
    });
  };

  // 설정 속성 업데이트 핸들러
  const updateSetting = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 처리 단계별 설정 업데이트 핸들러
  const updateStepSetting = (step, field, value) => {
    setSettings(prev => ({
      ...prev,
      [step]: {
        ...prev[step],
        [field]: value
      }
    }));
  };

  // 최종 저장 핸들러
  const handleSave = () => {
    if (onSave) {
      // 최종 설정값 전달
      onSave({
        ...settings,
        // API에 필요한 추가 형식 변환이 있으면 여기서 처리
      });
    }
    
    if (onClose) onClose();
  };

  // 모든 폼 요소에 대한 비활성화 상태 체크
  const isDisabled = useSimpleQuery;

  // 탭 아이템 렌더링
  const renderTabs = () => {
    const tabs = [
      { id: 'feature', label: '기능 활성화' },
    ];
    
    // 기능 활성화 여부와 쿼리만 전송 모드를 고려해 탭 추가
    if (!useSimpleQuery && settings.useCustomPrompt) {
      tabs.push({ id: 'prompt', label: '프롬프트 설정' });
    }
    
    // 데이터 컬렉션 탭도 쿼리만 전송 모드에 따라 표시
    if (!useSimpleQuery && settings.useDataCollection) {
      tabs.push({ id: 'data', label: '데이터 컬렉션' });
    }
    
    return (
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`py-2 px-4 font-medium ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  // 처리 단계 선택 메뉴 렌더링
  const renderStepSelector = () => {
    const steps = [
      { 
        id: 'classification', 
        label: '질문 분류', 
        enabled: settings.enableClassification,
        description: '질문의 주제와 의도를 식별하는 단계'
      },
      { 
        id: 'amplification', 
        label: '질문 확장', 
        enabled: settings.enableAmplification,
        description: '질문을 더 구체적으로 확장하는 단계'
      },
      { 
        id: 'generation', 
        label: '응답 생성', 
        enabled: true, // 항상 활성화
        description: '검색된 정보를 바탕으로 응답을 생성하는 단계'
      },
      { 
        id: 'validation', 
        label: '응답 검증', 
        enabled: settings.enableValidation,
        description: '생성된 응답의 정확성을 검증하는 단계'
      }
    ];
    
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">처리 단계 선택</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {steps.map(step => (
            <div
              key={step.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                !step.enabled ? 'opacity-50 cursor-not-allowed' : (
                  currentStep === step.id
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                )
              }`}
              onClick={() => step.enabled && setCurrentStep(step.id)}
            >
              <div className="flex items-start">
                <div className={`w-4 h-4 rounded-full mt-1 mr-3 flex-shrink-0 ${
                  currentStep === step.id && step.enabled
                    ? 'bg-blue-500' 
                    : 'border border-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium">{step.label}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 모델 선택 UI 렌더링
  const renderModelSelector = (step) => {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">AI 모델 선택</label>
        <div className="space-y-3">
          {models.map(model => (
            <div 
              key={model.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                settings[step].model === model.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => updateStepSetting(step, 'model', model.id)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                  settings[step].model === model.id 
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
    );
  };

  // 모델 파라미터 UI 렌더링
  const renderModelParameters = (step) => {
    return (
      <div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Temperature: {settings[step].temperature.toFixed(1)}
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">정확함</span>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1" 
              value={settings[step].temperature}
              onChange={(e) => updateStepSetting(step, 'temperature', parseFloat(e.target.value))}
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
            최대 토큰 수: {settings[step].maxTokens}
          </label>
          <input 
            type="range" 
            min="500" 
            max="8000" 
            step="100" 
            value={settings[step].maxTokens}
            onChange={(e) => updateStepSetting(step, 'maxTokens', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">
            응답 생성에 사용할 최대 토큰 수를 설정합니다. (약 750단어 = 1000토큰)
          </p>
        </div>
      </div>
    );
  };

  // 프롬프트 편집 UI 렌더링
  const renderPromptEditor = (step) => {
    return (
      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          {step === 'classification' && '질문 분류 프롬프트'}
          {step === 'amplification' && '질문 확장 프롬프트'}
          {step === 'generation' && '응답 생성 프롬프트'}
          {step === 'validation' && '응답 검증 프롬프트'}
        </label>
        <textarea
          value={settings[step].prompt}
          onChange={(e) => updateStepSetting(step, 'prompt', e.target.value)}
          placeholder="AI에게 전달할 프롬프트 지침을 입력하세요..."
          className="w-full min-h-[150px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-2">
          {step === 'classification' && '질문의 유형, 주제, 의도를 정확히 분류하는 방법을 지시하세요.'}
          {step === 'amplification' && '질문을 명확히 하고 검색 품질을 높이기 위한 질문 확장 방법을 지시하세요.'}
          {step === 'generation' && '검색된 정보를 바탕으로 질문에 답변하는 방법과 형식을 지시하세요.'}
          {step === 'validation' && '생성된 응답의 정확성과 완전성을 검증하는 방법을 지시하세요.'}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">통합 API 및 모델 설정</h2>
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
      
      {/* 탭 메뉴 */}
      {renderTabs()}
      
      {/* 기능 활성화 탭 */}
      {activeTab === 'feature' && (
        <div className="space-y-4">
          {useSimpleQuery && (
            <div className="rounded-md bg-blue-50 p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm text-blue-700 font-medium">쿼리만 전송 모드가 활성화되었습니다</p>
                  <p className="text-xs text-blue-600 mt-1">통합 설정을 변경하려면 먼저 쿼리만 전송 모드를 비활성화해주세요.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className={useSimpleQuery ? "opacity-50 pointer-events-none" : ""}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">커스텀 프롬프트 사용</div>
                <div className="text-sm text-gray-500">분류, 생성 등의 단계별 프롬프트 사용 여부</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.useCustomPrompt}
                  onChange={(e) => updateSetting('useCustomPrompt', e.target.checked)}
                  className="sr-only peer"
                  disabled={isDisabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">데이터 컬렉션 사용</div>
                <div className="text-sm text-gray-500">외부 데이터베이스에서 관련 문서 검색 사용 여부</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.useDataCollection}
                  onChange={(e) => updateSetting('useDataCollection', e.target.checked)}
                  className="sr-only peer"
                  disabled={isDisabled}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className={`pt-3 space-y-4 ${!settings.useCustomPrompt || isDisabled ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">처리 단계 활성화</div>
                  <div className="text-sm text-gray-500">사용할 프로세싱 단계를 선택하세요</div>
                </div>
              </div>
              
              <div className="space-y-3 pl-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableClassification"
                    checked={settings.enableClassification}
                    onChange={(e) => updateSetting('enableClassification', e.target.checked)}
                    disabled={!settings.useCustomPrompt || isDisabled}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableClassification" className="ml-2 text-gray-700">
                    질문 분류 (Classification)
                  </label>
                  <span className="ml-auto text-xs text-gray-500">
                    질문의 주제와 의도를 식별합니다
                  </span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAmplification"
                    checked={settings.enableAmplification}
                    onChange={(e) => updateSetting('enableAmplification', e.target.checked)}
                    disabled={!settings.useCustomPrompt || isDisabled}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="enableAmplification" className="ml-2 text-gray-700">
                    질문 확장 (Amplification)
                  </label>
                  <span className="ml-auto text-xs text-gray-500">
                    질문을 더 구체적으로 확장합니다
                  </span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableValidation"
                    checked={settings.enableValidation}
                    onChange={(e) => updateSetting('enableValidation', e.target.checked)}
                    disabled={!settings.useCustomPrompt || isDisabled}
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
        </div>
      )}
      
      {/* 모델 설정 탭 */}
      {activeTab === 'model' && (
        <div>
          {/* 처리 단계 선택 */}
          {renderStepSelector()}
          
          {/* 모델 선택 */}
          {renderModelSelector(currentStep)}
          
          {/* 모델 파라미터 설정 */}
          {renderModelParameters(currentStep)}
        </div>
      )}
      
      {/* 프롬프트 설정 탭 */}
      {activeTab === 'prompt' && settings.useCustomPrompt && (
        <div>
          {/* 처리 단계 선택 */}
          {renderStepSelector()}
          
          {/* 프롬프트 편집 */}
          {renderPromptEditor(currentStep)}
        </div>
      )}
      
      {/* 데이터 컬렉션 탭 */}
      {activeTab === 'data' && settings.useDataCollection && !useSimpleQuery && (
        <div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">데이터 컬렉션</label>
            <select 
              value={settings.collectionName}
              onChange={(e) => updateSetting('collectionName', e.target.value)}
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
            <label className="block text-gray-700 font-semibold mb-2">검색 결과 수 (Top K): {settings.topK}</label>
            <input 
              type="range" 
              min="1" 
              max="20" 
              value={settings.topK}
              onChange={(e) => updateSetting('topK', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              질의에 대해 반환할 최대 문서 수를 설정합니다.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={resetToDefaults}
          className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-200"
        >
          기본값으로 초기화
        </button>
        
        <div>
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
    </div>
  );
};

export default UnifiedSettings; 