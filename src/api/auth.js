import apiClient from './index';

// 로그인 API
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data || error;
  }
};

// 회원가입 API
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error.response?.data || error;
  }
};

// 로그아웃 API
export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error.response?.data || error;
  }
};

// 인증 상태 확인 API
export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Auth check error:', error);
    throw error.response?.data || error;
  }
};

// 비밀번호 재설정 요청 API
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiClient.post('/auth/password-reset', { email });
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error.response?.data || error;
  }
};

// 비밀번호 재설정 API
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Password reset error:', error);
    throw error.response?.data || error;
  }
}; 