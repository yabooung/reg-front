/**
 * 모의 API 응답을 제공하는 유틸리티 함수들
 */

// 지연 시간 설정 (ms)
const MOCK_DELAY = 1500;

// 모의 응답 생성 함수
export const createMockResponse = (query) => {
  // 쿼리 내용을 기반으로 다른 응답 반환
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
  
  if (query.includes('환경') || query.includes('환경법')) {
    return {
      answer: '최근 환경 관련 규제의 주요 변화는 다음과 같습니다:\n\n1. 탄소중립기본법 시행 (2022.03)\n2. 환경영향평가법 개정 (2023.01)\n3. 대기환경보전법 시행규칙 개정 (2023.05)\n\n특히 탄소중립기본법은 2050년까지 탄소중립 달성을 법제화하고, 이에 필요한 국가 비전과 정책 방향을 제시하고 있습니다.',
      references: [
        { title: '탄소중립기본법', url: 'https://example.com/env1' },
        { title: '환경영향평가법', url: 'https://example.com/env2' },
        { title: '대기환경보전법', url: 'https://example.com/env3' }
      ]
    };
  }
  
  if (query.includes('개인정보') || query.includes('개인정보보호법')) {
    return {
      answer: '개인정보보호법의 최근 주요 개정사항은 다음과 같습니다:\n\n1. 가명정보 개념 도입 및 활용 근거 마련 (2020.08)\n2. 개인정보 보호 감독기구 일원화 (2020.08)\n3. 개인정보 국외이전 요건 강화 (2023.03)\n\n특히 2023년 3월부터 시행된 개정안은 개인정보의 국외이전 시 정보주체에게 고지해야 할 사항을 확대하고, 국외이전 중단 요구권을 신설했습니다.',
      references: [
        { title: '개인정보보호법', url: 'https://example.com/privacy1' },
        { title: '개인정보보호법 시행령', url: 'https://example.com/privacy2' }
      ]
    };
  }
  
  // 기본 응답
  return {
    answer: `귀하의 질문 "${query}"에 대한 답변을 드립니다.\n\n관련 규제 정보를 찾아본 결과, 해당 질문에 대한 구체적인 규제 사항은 현재 진행 중인 법률 개정 과정에 있습니다. 보다 정확한 정보를 위해 최신 법령 내용을 참고하시거나, 더 구체적인 질문을 해주시면 더 정확한 답변을 드릴 수 있습니다.`,
    references: []
  };
};

// 모의 API 호출 함수
export const mockApiCall = (requestData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = {
        status: 200,
        data: createMockResponse(requestData.query)
      };
      resolve(response);
    }, MOCK_DELAY);
  });
};

// 개발 환경인지 확인
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development' || 
         (typeof window !== 'undefined' && window.ENV && window.ENV.IS_DEVELOPMENT);
};

// API 호출 또는 모의 호출 수행
export const callApiOrMock = async (url, data, config, useMock = isDevelopment()) => {
  if (useMock) {
    console.log('Using mock API response');
    return mockApiCall(data);
  }
  
  // 실제 API 호출
  return axios.post(url, data, config);
}; 