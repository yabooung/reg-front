import axios from 'axios';
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  API_TIMEOUT, 
  DEFAULT_MODEL_SETTINGS,
  MOCK_SETTINGS
} from './apiConfig';

// API 기본 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * 간소화된 채팅 요청 생성
 * @param {string} query - 사용자 질의 (필수)
 * @param {Object} options - 추가 옵션 (선택사항)
 * @returns {Object} - API 요청용 데이터 객체
 */
export const createChatRequest = (query, options = {}) => {
  // 기본 요청 (query만 필수)
  const baseRequest = {
    query: query
  };
  
  // 사용자가 추가 설정을 제공한 경우에만 확장
  if (Object.keys(options).length > 0) {
    // 기본 설정과 사용자 지정 옵션 병합
    const settings = {
      modelName: options.modelName || DEFAULT_MODEL_SETTINGS.modelName,
      temperature: options.temperature || DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: options.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens,
      topK: options.topK || DEFAULT_MODEL_SETTINGS.topK,
      collectionName: options.collectionName || DEFAULT_MODEL_SETTINGS.collectionName
    };
    
    // 선택적으로 추가 파라미터 설정
    return {
      ...baseRequest,
      enable_classification: options.enableClassification !== undefined ? options.enableClassification : true,
      enable_amplification: options.enableAmplification !== undefined ? options.enableAmplification : true,
      enable_validation: options.enableValidation !== undefined ? options.enableValidation : false,
      metadata: options.metadata || {},
      enable_steps: options.enableSteps || {
        classification: true,
        amplification: true,
        retrieval: true,
        generation: true,
        validation: false
      },
      custom_settings: options.customSettings || {
        classification: {
          prompt: options.classificationPrompt || "규제 관련 질문을 분류해주세요",
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        },
        amplification: {
          prompt: options.amplificationPrompt || "사용자 질문을 더 명확하게 확장해주세요",
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        },
        retrieval: {
          top_k: settings.topK,
          filter_threshold: options.filterThreshold || 0.7,
          collection_name: settings.collectionName,
          use_mmr: options.useMMR !== undefined ? options.useMMR : true,
          lambda_mult: options.lambdaMult || 0.5
        },
        generation: {
          prompt: options.generationPrompt || "찾은 정보를 바탕으로 질문에 답변해주세요",
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        },
        validation: {
          prompt: options.validationPrompt || "응답의 정확성을 검증해주세요",
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        }
      }
    };
  }
  
  // 기본 요청 반환 (query만 포함)
  return baseRequest;
};

/**
 * 채팅 API 호출 함수
 * @param {string} query - 사용자 질의
 * @param {Object} options - 추가 옵션
 * @returns {Promise} - API 응답 Promise
 */
export const sendChatRequest = async (query, options = {}) => {
  const requestData = createChatRequest(query, options);
  
  try {
    const response = await apiClient.post(API_ENDPOINTS.COT_RAG, requestData);
    return response.data;
  } catch (error) {
    console.error('Chat API 요청 오류:', error);
    throw error;
  }
};

/**
 * 사용 예시:
 * 
 * // 기본 사용법 (query만 전송)
 * const response = await sendChatRequest('최근 금융 규제 변경사항은 무엇인가요?');
 * 
 * // 고급 옵션 지정
 * const response = await sendChatRequest('환경법 주요 개정사항', {
 *   modelName: 'gpt-4-turbo',
 *   temperature: 0.5,
 *   collectionName: 'environmental_laws',
 *   enableClassification: false,  // 분류 단계 비활성화
 * });
 */

// 개발 환경에서 테스트용 모의 응답
const MOCK_DELAY = MOCK_SETTINGS.delay;

// 샘플 응답 생성 함수
const createMockResponse = (query) => {
  // 드론 관련 질문에 대한 구조화된 응답
  if (query.toLowerCase().includes('드론') || query.toLowerCase().includes('비행')) {
    return {
      raw_json: JSON.stringify({
        thinking_process: [
          "사용자가 드론 관련 법적 규제와 절차에 대해 질문했다.",
          "항공안전법의 무인항공기 관련 조항을 참고해야 한다.",
          "비행 허가 신청 절차와 필요 서류에 대한 정보도 제공해야 한다."
        ],
        answer_structure: {
          introduction: "드론을 안전하게 활용하기 위한 한국의 법적 규제와 절차를 안내합니다.",
          legal_basis: "항공안전법 제68조에 따르면 무인항공기의 비행 허가를 받아야 하며, 드론특별자유화구역 관련 규정도 적용됩니다.",
          analysis: "비행허가 신청 시 제출해야 할 서류 목록에는 성명, 주소, 무인항공기 정보, 비행 계획 등이 포함됩니다. 또한 고도 제한 및 비행 경로에 대한 규정도 준수해야 합니다.",
          practical_advice: "비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 허가 신청서를 제출하고, 필요한 서류를 미리 준비하는 것이 중요합니다.",
          limitations: "보다 구체적이고 복잡한 상황에 대해서는 법률 전문가와 상담하는 것이 필요합니다."
        },
        referenced_laws: [
          "항공안전법",
          "드론 활용의 촉진 및 기반조성에 관한 법률"
        ],
        referenced_precedents: [],
        legal_terms_explained: {
          "비행허가": "드론을 특정 지역에서 비행하기 위해 필요한 공식적인 승인을 의미합니다.",
          "고도 제한": "드론이 비행할 수 있는 최대 높이를 규정한 것입니다.",
          "드론특별자유화구역": "드론 관련 실용화와 사업화를 위한 특별히 지정된 지역을 말합니다."
        },
        final_answer: "드론을 한국에서 비행하기 위해서는 항공안전법 제68조에 따른 비행 허가가 필요합니다. 비행 허가 신청은 비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 필요 서류와 함께 제출해야 합니다. 필요 서류에는 신청자 정보, 드론 정보, 비행 계획 등이 포함됩니다. 드론특별자유화구역에서는 일부 규제가 완화되어 있으니 참고하시기 바랍니다."
      }),
      answer: "드론을 한국에서 비행하기 위해서는 항공안전법 제68조에 따른 비행 허가가 필요합니다. 비행 허가 신청은 비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 필요 서류와 함께 제출해야 합니다. 필요 서류에는 신청자 정보, 드론 정보, 비행 계획 등이 포함됩니다. 드론특별자유화구역에서는 일부 규제가 완화되어 있으니 참고하시기 바랍니다.",
      references: [
        { title: '항공안전법 제68조', url: 'https://example.com/aviation-law' },
        { title: '드론 활용의 촉진 및 기반조성에 관한 법률', url: 'https://example.com/drone-law' }
      ]
    };
  }
  
  // JSON 형식 응답 테스트 (CoT 과정이 포함된 응답)
  if (query.includes('COT') || query.includes('체인') || query.includes('사고')) {
    return {
      raw_json: JSON.stringify({
        thinking_process: [
          "원본 질문과 증폭된 질문은 모두 '안녕하세요'라는 인사말로, 사용자에게 명확한 법률적 요구가 없는 경우로 보인다.",
          "제공된 문서에는 '안녕하세요'라는 인사말만 있으며, 법률적 내용이나 정보는 포함되어 있지 않다.",
          "현재로서는 관련 법률, 판례, 또는 법적 원칙을 적용할 수 있는 정보가 없다.",
          "사용자가 궁금한 점이나 필요한 법률적 조치에 대해 구체적으로 질문할 수 있도록 유도하는 것이 실질적 조치로 보인다."
        ],
        answer_structure: {
          introduction: "안녕하세요라는 인사말로 시작하신 질문에 대해, 보다 구체적인 법률적 질문이 필요하다는 점을 안내드립니다.",
          legal_basis: "현재 제공된 정보에는 법률 조항이나 법적 근거가 포함되어 있지 않습니다.",
          analysis: "사용자가 법률적 문의를 하고자 하는 경우, 구체적인 상황이나 질문을 제시해야 합니다.",
          practical_advice: "추가적인 법률적 조언이 필요하시다면, 구체적인 질문을 통해 다시 문의해 주시기 바랍니다."
        },
        referenced_laws: [],
        referenced_precedents: [],
        legal_terms_explained: {},
        final_answer: "안녕하세요! 법률 상담을 원하신다면, 좀 더 구체적인 질문을 해주시면 도움을 드릴 수 있습니다. 예를 들어 특정 법률이나 상황에 대해 문의해 주시면 더 정확한 답변이 가능합니다."
      }),
      answer: "안녕하세요! 법률 상담을 원하신다면, 좀 더 구체적인 질문을 해주시면 도움을 드릴 수 있습니다. 예를 들어 특정 법률이나 상황에 대해 문의해 주시면 더 정확한 답변이 가능합니다.",
      references: []
    };
  }
  
  if (query.includes('금융') || query.includes('금융 규제')) {
    return {
      answer: '2023년 금융 규제의 주요 변경사항은 다음과 같습니다:\n\n1. 자본시장법 개정안 시행 (2023.04)\n2. 금융소비자보호법 시행령 일부 개정 (2023.06)\n3. 디지털 자산 기본법 제정 (2023.08)\n\n특히 디지털 자산 기본법은 가상자산 투자자 보호와 시장 안정성 확보를 주요 목표로 하고 있습니다.',
      references: [
        { title: '자본시장법 개정안', url: 'https://example.com/ref1' },
        { title: '금융소비자보호법 시행령', url: 'https://example.com/ref2' },
        { title: '디지털 자산 기본법', url: 'https://example.com/ref3' }
      ]
    };
  }
  
  return {
    answer: `귀하의 질문 "${query}"에 대한 답변을 드립니다.\n\n관련 규제 정보를 찾아본 결과, 해당 질문에 대한 구체적인 규제 사항은 현재 진행 중인 법률 개정 과정에 있습니다. 보다 정확한 정보를 위해 최신 법령 내용을 참고하시거나, 더 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다.`,
    references: []
  };
};

// 개발 환경용 모의 API 호출
export const sendMockChatRequest = (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockResponse(query));
    }, MOCK_DELAY);
  });
};

// 개발/프로덕션 환경 구분하여 API 호출
export const chatWithAI = async (query, options = {}, useMock = MOCK_SETTINGS.enabled) => {
  if (useMock) {
    console.log('Using mock API response');
    return sendMockChatRequest(query);
  }
  
  return sendChatRequest(query, options);
}; 