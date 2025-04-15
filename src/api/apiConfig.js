// API 기본 URL
export const API_BASE_URL = 'http://127.0.0.1:8002/api';

// API 엔드포인트 목록
export const API_ENDPOINTS = {
  COT_RAG: '/cot-rag',
  CHAT: '/chat',
  SEARCH: '/search',
  DOCUMENTS: '/documents'
};

// API 기본 타임아웃 (300초)
export const API_TIMEOUT = 300000;

// API 기본 설정
export const DEFAULT_API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT
};

// API 모델 옵션 기본값
export const DEFAULT_MODEL_SETTINGS = {
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500,
  topK: 5,
  collectionName: 'kised_regfinder_old_law_db_20241129' // 나중에 db에서 가져오기
};

// 개발용 모의 응답 설정
export const MOCK_SETTINGS = {
  enabled: import.meta.env.DEV,
  delay: 1500
}; 