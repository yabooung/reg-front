import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

const PrivateRoute = ({ children }) => {
  // 인증 체크를 비활성화하고 항상 children을 렌더링
  return children;
  
  // 원래 코드 (주석 처리)
  /*
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
  */
};

export default PrivateRoute; 