import React, { createContext, useState, useContext } from 'react';
import { DEFAULT_MODEL_SETTINGS } from '../api/apiConfig';

// 설정 컨텍스트 생성
const SettingsContext = createContext();

// 설정 컨텍스트 제공자 컴포넌트
export const SettingsProvider = ({ children }) => {
  // 목업 모드 상태
  const [useMock, setUseMock] = useState(true);
  
  // 단순 쿼리 모드 상태 (기본값을 true로 변경)
  const [useSimpleQuery, setUseSimpleQuery] = useState(true);
  
  // API 모델과 프롬프트 사용 여부 설정
  const [useApiModel, setUseApiModel] = useState(true);
  const [useCustomPrompt, setUseCustomPrompt] = useState(true);
  
  // API 옵션 상태
  const [apiOptions, setApiOptions] = useState({
    modelName: DEFAULT_MODEL_SETTINGS.modelName,
    temperature: DEFAULT_MODEL_SETTINGS.temperature,
    maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
    topK: DEFAULT_MODEL_SETTINGS.topK,
    enableClassification: true,
    enableAmplification: true,
    enableValidation: false,
    collectionName: DEFAULT_MODEL_SETTINGS.collectionName
  });
  
  // 통합 설정 상태
  const [unifiedSettings, setUnifiedSettings] = useState({
    model: DEFAULT_MODEL_SETTINGS.modelName,
    temperature: DEFAULT_MODEL_SETTINGS.temperature,
    maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
    enableClassification: true,
    enableAmplification: true,
    enableValidation: false,
    topK: DEFAULT_MODEL_SETTINGS.topK,
    collectionName: DEFAULT_MODEL_SETTINGS.collectionName,
    promptTemplate: 'default',
    promptName: '기본 규제 검색',
    prompt: '주어진 규제 관련 질문에 대해 명확하고 정확하게 응답해주세요. 관련 법규와 제정/개정 날짜를 포함시키고, 필요한 경우 실제 적용 사례를 설명해주세요.'
  });
  
  // 목업 모드 토글 함수
  const toggleMockMode = () => {
    setUseMock(prev => !prev);
  };
  
  // 단순 쿼리 모드 토글
  const toggleSimpleQuery = () => {
    setUseSimpleQuery(prev => !prev);
  };
  
  // API 모델 사용 토글
  const toggleApiModel = () => {
    setUseApiModel(prev => !prev);
  };
  
  // 커스텀 프롬프트 사용 토글
  const toggleCustomPrompt = () => {
    setUseCustomPrompt(prev => !prev);
  };
  
  // API 옵션 변경 핸들러
  const handleApiOptionChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 입력 타입에 따라 값 처리
    const processedValue = type === 'checkbox' 
      ? checked 
      : type === 'number' 
        ? parseFloat(value) 
        : value;
    
    setApiOptions(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };
  
  // API 설정 초기화
  const resetApiOptions = () => {
    setApiOptions({
      modelName: DEFAULT_MODEL_SETTINGS.modelName,
      temperature: DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: DEFAULT_MODEL_SETTINGS.maxTokens,
      topK: DEFAULT_MODEL_SETTINGS.topK,
      enableClassification: true,
      enableAmplification: true,
      enableValidation: false,
      collectionName: DEFAULT_MODEL_SETTINGS.collectionName
    });
    setUseSimpleQuery(true); // 초기화 시에도 쿼리만 전송 모드 유지
    setUseApiModel(true);
    setUseCustomPrompt(true);
  };
  
  // 통합 설정 저장 핸들러
  const saveUnifiedSettings = (newSettings) => {
    setUnifiedSettings({...unifiedSettings, ...newSettings});
    
    // API 옵션도 함께 업데이트
    setApiOptions({
      modelName: newSettings.model || apiOptions.modelName,
      temperature: newSettings.temperature || apiOptions.temperature,
      maxTokens: newSettings.maxTokens || apiOptions.maxTokens,
      topK: newSettings.topK || apiOptions.topK,
      enableClassification: newSettings.enableClassification !== undefined 
        ? newSettings.enableClassification 
        : apiOptions.enableClassification,
      enableAmplification: newSettings.enableAmplification !== undefined 
        ? newSettings.enableAmplification 
        : apiOptions.enableAmplification,
      enableValidation: newSettings.enableValidation !== undefined 
        ? newSettings.enableValidation 
        : apiOptions.enableValidation,
      collectionName: newSettings.collectionName || DEFAULT_MODEL_SETTINGS.collectionName
    });
  };
  
  // 컨텍스트에 제공할 값
  const value = {
    useMock,
    toggleMockMode,
    useSimpleQuery,
    toggleSimpleQuery,
    useApiModel,
    toggleApiModel,
    useCustomPrompt,
    toggleCustomPrompt,
    apiOptions,
    handleApiOptionChange,
    resetApiOptions,
    unifiedSettings,
    saveUnifiedSettings
  };
  
  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

// 설정 컨텍스트 사용을 위한 커스텀 훅
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext; 