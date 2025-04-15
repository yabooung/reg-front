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
  
  // API 모델 비활성화 또는 커스텀 프롬프트 비활성화 상태 확인
  const useApiModel = options.useApiModel !== undefined ? options.useApiModel : true;
  const useCustomPrompt = options.useCustomPrompt !== undefined ? options.useCustomPrompt : true;
  
  // 단순 쿼리 모드 또는 API 모델과 프롬프트가 모두 비활성화된 경우 기본 요청만 반환
  if (options.useSimpleQuery || (!useApiModel && !useCustomPrompt)) {
    return baseRequest;
  }
  
  // 사용자가 추가 설정을 제공한 경우에만 확장
  if (Object.keys(options).length > 0) {
    // 기본 설정과 사용자 지정 옵션 병합
    const settings = {
      modelName: useApiModel ? (options.modelName || DEFAULT_MODEL_SETTINGS.modelName) : DEFAULT_MODEL_SETTINGS.modelName,
      temperature: useApiModel ? (options.temperature || DEFAULT_MODEL_SETTINGS.temperature) : DEFAULT_MODEL_SETTINGS.temperature,
      maxTokens: useApiModel ? (options.maxTokens || DEFAULT_MODEL_SETTINGS.maxTokens) : DEFAULT_MODEL_SETTINGS.maxTokens,
      topK: useApiModel ? (options.topK || DEFAULT_MODEL_SETTINGS.topK) : DEFAULT_MODEL_SETTINGS.topK,
      collectionName: options.collectionName || DEFAULT_MODEL_SETTINGS.collectionName
    };
    
    // 프롬프트 설정이 비활성화된 경우 기본값 사용
    const enableClassification = useCustomPrompt ? (options.enableClassification !== undefined ? options.enableClassification : true) : true;
    const enableAmplification = useCustomPrompt ? (options.enableAmplification !== undefined ? options.enableAmplification : true) : true;
    const enableValidation = useCustomPrompt ? (options.enableValidation !== undefined ? options.enableValidation : false) : false;
    
    // 프롬프트 값 설정 - 비활성화 시 빈 문자열
    const classificationPrompt = useCustomPrompt ? (options.classificationPrompt || "규제 관련 질문을 분류해주세요") : "";
    const amplificationPrompt = useCustomPrompt ? (options.amplificationPrompt || "사용자 질문을 더 명확하게 확장해주세요") : "";
    const generationPrompt = useCustomPrompt ? (options.generationPrompt || "찾은 정보를 바탕으로 질문에 답변해주세요") : "";
    const validationPrompt = useCustomPrompt ? (options.validationPrompt || "응답의 정확성을 검증해주세요") : "";
    
    // 선택적으로 추가 파라미터 설정
    return {
      ...baseRequest,
      enable_classification: enableClassification,
      enable_amplification: enableAmplification,
      enable_validation: enableValidation,
      metadata: options.metadata || {},
      enable_steps: options.enableSteps || {
        classification: enableClassification,
        amplification: enableAmplification,
        retrieval: true,
        generation: true,
        validation: enableValidation
      },
      custom_settings: options.customSettings || {
        classification: {
          prompt: classificationPrompt,
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        },
        amplification: {
          prompt: amplificationPrompt,
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
          prompt: generationPrompt,
          model_settings: {
            model_name: settings.modelName,
            temperature: settings.temperature,
            max_tokens: settings.maxTokens
          }
        },
        validation: {
          prompt: validationPrompt,
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
  // 기본 응답 템플릿
  const defaultResponse = {
    raw_json: JSON.stringify({
      thinking_process: [
        "1단계 분석 결과: 사용자의 질문을 파악하고 관련 법률 분야 식별",
        "2단계 분석 결과: 관련 법령 및 조항 검색",
        "3단계 분석 결과: 적용 가능한 법적 원칙 확인",
        "4단계 분석 결과: 유사 판례 및 법적 해석 검토",
        "5단계 분석 결과: 질문에 대한 직접적인 답변 구성",
        "6단계 분석 결과: 실용적인 조언 추가",
        "7단계 분석 결과: 응답의 정확성 검증"
      ],
      question_breakdown: [
        {
          question: "원본 질문: " + query,
          answer: "해당 질문에 대한 상세 답변으로, 현행 법률과 규제에 따르면 이 사안은 다음과 같이 해석됩니다...",
          legal_basis: "관련 법률: 해당 법률 제00조 제0항에 따르면..."
        }
      ],
      referenced_laws: ["관련 법률 1", "관련 법률 2", "관련 시행령"],
      legal_terms_explained: {
        "법률용어1": "일반인이 이해하기 쉬운 설명",
        "법률용어2": "일반인이 이해하기 쉬운 설명"
      },
      final_answer: `귀하의 질문 "${query}"에 대해 답변드립니다. 현행 법률에 따르면 이 사안은 다음과 같이 처리됩니다... (법률 근거와 실질적 조언을 포함한 종합적 답변)`
    }),
    answer: `귀하의 질문 "${query}"에 대해 답변드립니다. 현행 법률에 따르면 이 사안은 다음과 같이 처리됩니다... (법률 근거와 실질적 조언을 포함한 종합적 답변)`,
    references: [
      { title: '관련 법률 1', url: 'https://example.com/law1' },
      { title: '관련 법률 2', url: 'https://example.com/law2' }
    ]
  };

  // 드론 관련 질문에 대한 구조화된 응답
  if (query.toLowerCase().includes('드론') || query.toLowerCase().includes('비행')) {
    return {
      raw_json: JSON.stringify({
        thinking_process: [
          "1단계 분석 결과: 드론 비행에 관한 법적 규제를 묻는 질문으로 파악",
          "2단계 분석 결과: 항공안전법과 드론 활용 촉진법 등 관련 법령 검색",
          "3단계 분석 결과: 드론 비행 허가와 관련된 법적 요건 확인",
          "4단계 분석 결과: 비행허가 신청 절차와 관련된 행정 규정 검토",
          "5단계 분석 결과: 드론특별자유화구역 관련 규제 완화 정책 확인",
          "6단계 분석 결과: 비행 허가 신청에 필요한 실용적 정보 추가",
          "7단계 분석 결과: 최종 응답의 정확성 검증"
        ],
        question_breakdown: [
          {
            question: "드론 비행을 위한 법적 요건은 무엇인가요?",
            answer: "드론 비행을 위해서는 항공안전법 제68조에 따라 비행 허가를 받아야 합니다. 비행 허가는 드론의 무게, 비행 목적, 비행 장소에 따라 요건이 달라집니다. 특히 12kg 이상의 드론은 항상 비행 허가가 필요합니다.",
            legal_basis: "항공안전법 제68조(초경량비행장치 등), 동법 시행규칙 제308조(무인비행장치 등의 비행승인)"
          },
          {
            question: "드론 비행 허가 신청은 어떻게 하나요?",
            answer: "비행 허가 신청은 비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 필요 서류와 함께 제출해야 합니다. 온라인으로는 '드론 원스톱 민원서비스'를 통해 신청 가능합니다.",
            legal_basis: "항공안전법 시행규칙 제308조(무인비행장치 등의 비행승인), 드론 활용의 촉진 및 기반조성에 관한 법률 제15조(원스톱 서비스)"
          }
        ],
        referenced_laws: [
          "항공안전법 제68조(초경량비행장치 등)",
          "항공안전법 시행규칙 제308조(무인비행장치 등의 비행승인)",
          "드론 활용의 촉진 및 기반조성에 관한 법률"
        ],
        legal_terms_explained: {
          "비행허가": "드론을 특정 지역에서 비행하기 위해 관할 당국으로부터 받아야 하는 공식적인 승인을 의미합니다.",
          "초경량비행장치": "항공법상 드론을 포함한 무인비행장치를 지칭하는 법률 용어로, 자체중량 150kg 이하인 무인비행기, 무인헬리콥터 등을 말합니다.",
          "드론특별자유화구역": "드론 관련 실용화와 사업화를 위해 특별히 지정된 지역으로, 일부 규제가 완화된 구역을 말합니다."
        },
        final_answer: "드론을 한국에서 비행하기 위해서는 항공안전법 제68조에 따른 비행 허가가 필요합니다. 비행 허가 신청은 비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 필요 서류와 함께 제출해야 합니다. 필요 서류에는 신청자 정보, 드론 정보, 비행 계획 등이 포함됩니다. 온라인으로는 '드론 원스톱 민원서비스'를 통해 편리하게 신청할 수 있습니다. 12kg 이상의 드론은 항상 비행 허가가 필요하며, 비행 장소와 목적에 따라 요건이 달라질 수 있으니 유의하시기 바랍니다. 드론특별자유화구역에서는 일부 규제가 완화되어 있으므로 참고하시기 바랍니다."
      }),
      answer: "드론을 한국에서 비행하기 위해서는 항공안전법 제68조에 따른 비행 허가가 필요합니다. 비행 허가 신청은 비행 예정일 7일 전까지 지방항공청이나 항공교통본부에 필요 서류와 함께 제출해야 합니다. 필요 서류에는 신청자 정보, 드론 정보, 비행 계획 등이 포함됩니다. 드론특별자유화구역에서는 일부 규제가 완화되어 있으니 참고하시기 바랍니다.",
      references: [
        { title: '항공안전법 제68조', url: 'https://example.com/aviation-law' },
        { title: '드론 활용의 촉진 및 기반조성에 관한 법률', url: 'https://example.com/drone-law' }
      ]
    };
  }
  
  // 금융 규제 관련 질문
  if (query.includes('금융') || query.includes('금융 규제')) {
    return {
      raw_json: JSON.stringify({
        thinking_process: [
          "1단계 분석 결과: 금융 규제 관련 질문 파악",
          "2단계 분석 결과: 최근 개정된 관련 금융법 검색",
          "3단계 분석 결과: 자본시장법, 금융소비자보호법, 디지털 자산 기본법 확인",
          "4단계 분석 결과: 각 법령의 주요 변경사항 식별",
          "5단계 분석 결과: 디지털 자산 관련 규제 변화 분석",
          "6단계 분석 결과: 금융소비자에 대한 영향 분석",
          "7단계 분석 결과: 최종 응답의 정확성 및 완결성 검증"
        ],
        question_breakdown: [
          {
            question: "최근 금융 규제의 주요 변경사항은 무엇인가요?",
            answer: "2023년에는 자본시장법 개정안(2023.04), 금융소비자보호법 시행령 일부 개정(2023.06), 디지털 자산 기본법 제정(2023.08) 등 주요 금융 법률의 변화가 있었습니다.",
            legal_basis: "자본시장과 금융투자업에 관한 법률(2023.04 개정), 금융소비자 보호에 관한 법률 시행령(2023.06 개정), 디지털 자산 기본법(2023.08 제정)"
          },
          {
            question: "디지털 자산 기본법의 주요 내용은 무엇인가요?",
            answer: "디지털 자산 기본법은 가상자산 투자자 보호와 시장 안정성 확보를 주요 목표로 합니다. 디지털 자산 사업자 등록제와 자본금 요건 강화, 디지털 자산 상장 심사 기준 마련, 투자자 보호를 위한 의무 공시 항목 확대 등을 규정하고 있습니다.",
            legal_basis: "디지털 자산 기본법 제3조(사업자 등록), 제12조(자본금 요건), 제25조(투자자 보호)"
          }
        ],
        referenced_laws: [
          "자본시장과 금융투자업에 관한 법률(2023.04 개정)",
          "금융소비자 보호에 관한 법률 시행령(2023.06 개정)",
          "디지털 자산 기본법(2023.08 제정)"
        ],
        legal_terms_explained: {
          "디지털 자산": "블록체인 등 분산원장기술을 이용하여 전자적으로 거래되는 경제적 가치를 지닌 자산을 의미합니다.",
          "금융소비자보호법": "금융상품 판매 및 자문 과정에서 소비자 권익을 보호하기 위한 법률입니다.",
          "사업자 등록제": "특정 사업을 영위하기 위해 관할 당국에 등록을 의무화하는 제도입니다."
        },
        final_answer: "2023년 금융 규제의 주요 변경사항으로는 자본시장법 개정안(2023.04), 금융소비자보호법 시행령 일부 개정(2023.06), 디지털 자산 기본법 제정(2023.08) 등이 있습니다. 특히 디지털 자산 기본법은 가상자산 투자자 보호와 시장 안정성 확보를 주요 목표로 하고 있으며, 디지털 자산 사업자에 대한 등록제와 자본금 요건 강화, 투자자 보호 조치 등을 규정하고 있습니다. 금융소비자보호법 시행령 개정은 금융상품 판매 과정에서의 투명성과 소비자 권익 보호를 강화하는 방향으로 이루어졌습니다. 이러한 변화는 디지털 금융 환경에서의 소비자 보호와 시장 안정성을 높이는 데 기여할 것으로 예상됩니다."
      }),
      answer: '2023년 금융 규제의 주요 변경사항은 다음과 같습니다:\n\n1. 자본시장법 개정안 시행 (2023.04)\n2. 금융소비자보호법 시행령 일부 개정 (2023.06)\n3. 디지털 자산 기본법 제정 (2023.08)\n\n특히 디지털 자산 기본법은 가상자산 투자자 보호와 시장 안정성 확보를 주요 목표로 하고 있습니다.',
      references: [
        { title: '자본시장법 개정안', url: 'https://example.com/ref1' },
        { title: '금융소비자보호법 시행령', url: 'https://example.com/ref2' },
        { title: '디지털 자산 기본법', url: 'https://example.com/ref3' }
      ]
    };
  }
  
  return defaultResponse;
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
  // 모의 응답 사용 시 모델/프롬프트 설정 상태 확인
  const useApiModel = options.useApiModel !== undefined ? options.useApiModel : true;
  const useCustomPrompt = options.useCustomPrompt !== undefined ? options.useCustomPrompt : true;
  
  // 단순 쿼리 모드이거나 모든 설정이 꺼져있는 경우 기본 응답
  const useSimpleMode = options.useSimpleQuery || (!useApiModel && !useCustomPrompt);
  
  if (useMock) {
    console.log('Using mock API response');
    console.log(`Settings: API Model: ${useApiModel ? 'ON' : 'OFF'}, Custom Prompt: ${useCustomPrompt ? 'ON' : 'OFF'}, Simple Mode: ${useSimpleMode ? 'ON' : 'OFF'}`);
    
    // 단순 쿼리 모드일 때는 간단한 응답만 반환
    if (useSimpleMode) {
      return {
        answer: `"${query}"에 대한 간단한 답변입니다. (단순 쿼리 모드)`
      };
    }
    
    return sendMockChatRequest(query);
  }
  
  return sendChatRequest(query, options);
}; 