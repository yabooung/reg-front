import axios from 'axios';
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  API_TIMEOUT, 
  DEFAULT_MODEL_SETTINGS,
  MOCK_SETTINGS
} from '../../api/apiConfig';

// API 기본 설정
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Supervisor API에 맞춘 채팅 요청 생성
 * @param {string} query - 사용자 질의 (필수)
 * @param {Object} options - 추가 옵션 (선택사항)
 * @returns {Object} - API 요청용 데이터 객체
 */
export const createChatRequest = (query, options = {}) => {
  return {
    query: query,
    session_id: options.sessionId || null,
    user_id: options.userId || "anonymous",
    stream_options: {
      include_steps: options.includeSteps !== undefined ? options.includeSteps : true,
      include_documents: options.includeDocuments !== undefined ? options.includeDocuments : false,
      include_metrics: options.includeMetrics !== undefined ? options.includeMetrics : true
    }
  };
};

/**
 * SSE (Server-Sent Events) 스트리밍 응답 처리
 * @param {string} query - 사용자 질의
 * @param {Object} options - 추가 옵션
 * @param {Function} onEvent - 이벤트 콜백 함수
 * @returns {EventSource} - EventSource 객체
 */
export const streamChatRequest = (query, options = {}, onEvent) => {
  const requestData = createChatRequest(query, options);
  
  // EventSource를 사용한 SSE 스트리밍
  const eventSource = new EventSource(
    `${API_BASE_URL}/v1/supervisor/chat/stream?` + new URLSearchParams({
      query: requestData.query,
      session_id: requestData.session_id || '',
      user_id: requestData.user_id
    })
  );
  
  // 이벤트 리스너 설정
  eventSource.addEventListener('start', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'start', data });
  });
  
  eventSource.addEventListener('analysis', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'analysis', data });
  });
  
  eventSource.addEventListener('agent_start', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'agent_start', data });
  });
  
  eventSource.addEventListener('agent_complete', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'agent_complete', data });
  });
  
  eventSource.addEventListener('answer', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'answer', data });
  });
  
  eventSource.addEventListener('metrics', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'metrics', data });
  });
  
  eventSource.addEventListener('end', (event) => {
    const data = JSON.parse(event.data);
    onEvent({ type: 'end', data });
    eventSource.close();
  });
  
  eventSource.addEventListener('error', (event) => {
    if (event.data) {
      const data = JSON.parse(event.data);
      onEvent({ type: 'error', data });
    }
    eventSource.close();
  });
  
  eventSource.onerror = (error) => {
    console.error('SSE Connection error:', error);
    eventSource.close();
  };
  
  return eventSource;
};

/**
 * POST 방식으로 스트리밍 채팅 요청
 * fetch API를 사용하여 스트리밍 응답 처리
 */
export const streamChatRequestPost = async (query, options = {}, onEvent) => {
  const requestData = createChatRequest(query, options);
  
  try {
    const response = await fetch(`${API_BASE_URL}/v1/supervisor/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('event:')) {
          const eventType = line.substring(6).trim();
          const dataLine = lines[lines.indexOf(line) + 1];
          
          if (dataLine && dataLine.startsWith('data:')) {
            const data = JSON.parse(dataLine.substring(5).trim());
            onEvent({ type: eventType, data });
          }
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    onEvent({ type: 'error', data: { error: error.message } });
  }
};

/**
 * 일반 채팅 API 호출 (비스트리밍)
 * @param {string} query - 사용자 질의
 * @param {Object} options - 추가 옵션
 * @returns {Promise} - API 응답 Promise
 */
export const sendChatRequest = async (query, options = {}) => {
  const requestData = createChatRequest(query, options);
  
  try {
    const response = await apiClient.post('/v1/supervisor/chat', requestData);
    return response.data;
  } catch (error) {
    console.error('Chat API 요청 오류:', error);
    throw error;
  }
};

/**
 * 세션 히스토리 조회
 * @param {string} sessionId - 세션 ID
 * @param {number} limit - 조회할 대화 수 (기본값: 50)
 * @returns {Promise} - API 응답 Promise
 */
export const getSessionHistory = async (sessionId, limit = 50) => {
  try {
    const response = await apiClient.get(`/v1/supervisor/sessions/${sessionId}/history`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Session history API 요청 오류:', error);
    throw error;
  }
};

// 개발 환경에서 테스트용 모의 응답
const MOCK_DELAY = MOCK_SETTINGS.delay;

// 샘플 스트리밍 이벤트 생성 함수
const createMockStreamingEvents = (query) => {
  const events = [
    {
      type: 'start',
      data: {
        session_id: `session_${Date.now()}`,
        query: query,
        message: '처리를 시작합니다...'
      },
      delay: 0
    },
    {
      type: 'analysis',
      data: {
        complexity: 'simple',
        suggested_agents: ['search'],
        message: '쿼리 분석 완료'
      },
      delay: 500
    },
    {
      type: 'agent_start',
      data: {
        agent: 'search',
        message: 'search 에이전트 실행 중...'
      },
      delay: 1000
    },
    {
      type: 'agent_complete',
      data: {
        agent: 'search',
        confidence: 0.85,
        processing_time: 1000,
        message: 'search 완료'
      },
      delay: 2000
    },
    {
      type: 'answer',
      data: {
        answer: `"${query}"에 대한 답변입니다. 현행 법률에 따르면 이 사안은 다음과 같이 처리됩니다...`,
        confidence: 0.85,
        message: '답변 완료'
      },
      delay: 2500
    },
    {
      type: 'metrics',
      data: {
        total_time: 2500,
        agents_used: 1,
        documents_found: 3,
        quality_score: 0.85
      },
      delay: 2600
    },
    {
      type: 'end',
      data: {
        session_id: `session_${Date.now()}`,
        message: '처리 완료'
      },
      delay: 2700
    }
  ];
  
  return events;
};

// 개발 환경용 모의 스트리밍
export const mockStreamChat = (query, onEvent) => {
  const events = createMockStreamingEvents(query);
  
  events.forEach(event => {
    setTimeout(() => {
      onEvent(event);
    }, event.delay);
  });
  
  // 취소 함수 반환
  return {
    close: () => {
      console.log('Mock stream closed');
    }
  };
};

// 개발/프로덕션 환경 구분하여 API 호출
export const chatWithAI = async (query, options = {}, useMock = MOCK_SETTINGS.enabled) => {
  if (useMock) {
    console.log('Using mock API response');
    
    // 스트리밍 모드인 경우
    if (options.streaming && options.onEvent) {
      return mockStreamChat(query, options.onEvent);
    }
    
    // 일반 모드인 경우
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            answer: `"${query}"에 대한 답변입니다. 현행 법률에 따르면...`,
            confidence: 0.85,
            agents_used: ['search'],
            processing_time: 2000
          }
        });
      }, MOCK_DELAY);
    });
  }
  
  // 실제 API 호출
  if (options.streaming && options.onEvent) {
    return streamChatRequestPost(query, options, options.onEvent);
  }
  
  return sendChatRequest(query, options);
};