import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!credentials.email) newErrors.email = '이메일을 입력해주세요';
    if (!credentials.password) newErrors.password = '비밀번호를 입력해주세요';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await login(credentials);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form-container">
          <h1>로그인</h1>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="이메일"
                value={credentials.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            
            <div className="form-group">
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={credentials.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </Button>
          </form>
          
          <div className="auth-links">
            <p>
              계정이 없으신가요? <Link to="/register">회원가입</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 