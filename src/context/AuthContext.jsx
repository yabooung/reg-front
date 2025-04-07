import { createContext, useState } from 'react';
// import { login, register, logout, checkAuth } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 테스트를 위해 항상 인증된 상태로 설정
  const [user, setUser] = useState({ id: '1', name: '테스트 사용자', email: 'test@example.com' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 더미 함수들
  const handleLogin = async () => {
    console.log('로그인 시도 (테스트 모드)');
    return true;
  };

  const handleRegister = async () => {
    console.log('회원가입 시도 (테스트 모드)');
    return true;
  };

  const handleLogout = async () => {
    console.log('로그아웃 시도 (테스트 모드)');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: true, // 항상 인증된 상태
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 