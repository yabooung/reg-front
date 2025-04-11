/**
 * API 관련 설정 정보
 */

// API 기본 URL
export const API_BASE_URL = 
  (typeof window !== 'undefined' && window.ENV && window.ENV.REACT_APP_API_BASE_URL) 
  || 'https://api.your-backend.com';

// API 엔드포인트
export const API_ENDPOINTS = {
  CHAT: '/chat',
  USER: '/user',
  AUTH: '/auth'
};

// API 기본 타임아웃 (30초)
export const API_TIMEOUT = 30000;

// API 요청 기본 설정
export const DEFAULT_API_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT
};

// 기본 모델 설정
export const DEFAULT_MODEL_SETTINGS = {
  model_name: "gpt-4",
  temperature: 0.7,
  max_tokens: 500
};

// 커스텀 프롬프트 설정
export const DEFAULT_PROMPTS = {
  classification: "규제 관련 질문을 분류해주세요",
  amplification: "사용자 질문을 더 명확하게 확장해주세요",
  generation: "찾은 정보를 바탕으로 질문에 답변해주세요",
  validation: "응답의 정확성을 검증해주세요"
};

// 검색 설정
export const DEFAULT_RETRIEVAL_SETTINGS = {
  top_k: 5,
  filter_threshold: 0.7,
  collection_name: "regulations",
  use_mmr: true,
  lambda_mult: 0.5
};

// API 요청 생성 함수
export const createChatRequest = (query) => {
  return {
    query,
    enable_classification: true,
    enable_amplification: true,
    enable_validation: false,
    metadata: {},
    enable_steps: {
      classification: true,
      amplification: true,
      retrieval: true,
      generation: true,
      validation: false
    },
    custom_settings: {
      classification: {
        prompt: DEFAULT_PROMPTS.classification,
        model_settings: DEFAULT_MODEL_SETTINGS
      },
      amplification: {
        prompt: DEFAULT_PROMPTS.amplification,
        model_settings: DEFAULT_MODEL_SETTINGS
      },
      retrieval: DEFAULT_RETRIEVAL_SETTINGS,
      generation: {
        prompt: DEFAULT_PROMPTS.generation,
        model_settings: DEFAULT_MODEL_SETTINGS
      },
      validation: {
        prompt: DEFAULT_PROMPTS.validation,
        model_settings: DEFAULT_MODEL_SETTINGS
      }
    }
  };
}; 