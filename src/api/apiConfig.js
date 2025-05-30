// API 기본 URL - 실제 백엔드 URL로 변경 필요
// export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://34.46.39.109:8333/api';

// API 엔드포인트 목록
export const API_ENDPOINTS = {
  // Supervisor API 엔드포인트
  CHAT_STREAM: '/v1/supervisor/chat/stream',
  CHAT: '/v1/supervisor/chat',
  SESSION_HISTORY: '/v1/supervisor/sessions',
  
  // 기존 엔드포인트 (필요시 사용)
  COT_RAG: '/cot-rag',
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

// 스트림 옵션 기본값
export const DEFAULT_STREAM_OPTIONS = {
  include_steps: true,      // 중간 단계 포함
  include_documents: false, // 문서 내용 포함
  include_metrics: true     // 성능 메트릭 포함
};

// API 모델 옵션 기본값 (Supervisor API는 자체적으로 관리하므로 필요시 사용)
export const DEFAULT_MODEL_SETTINGS = {
  modelName: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 500,
  topK: 5,
  collectionName: 'kised_regfinder_old_law_db_20241129'
};

// 개발용 모의 응답 설정
export const MOCK_SETTINGS = {
  enabled: import.meta.env.DEV || false,
  delay: 1500
};