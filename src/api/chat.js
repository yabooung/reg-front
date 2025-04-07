import apiClient from './index';

// 메시지 목록 가져오기
export const getMessages = async (conversationId) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

// 새 메시지 전송
export const sendMessage = async ({ content, conversationId }) => {
  try {
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// 새 대화 시작
export const startConversation = async () => {
  try {
    const response = await apiClient.post('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
};

// 대화 기록 가져오기
export const getConversationHistory = async () => {
  try {
    const response = await apiClient.get('/conversations');
    return response.data;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
}; 