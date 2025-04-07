import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { register, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!userData.name) newErrors.name = '이름을 입력해주세요';
    if (!userData.email) newErrors.email = '이메일을 입력해주세요';
    if (!userData.password) newErrors.password = '비밀번호를 입력해주세요';
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    try {
      await register(userData);
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-form-container">
          <h1>회원가입</h1>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Input
                type="text"
                name="name"
                placeholder="이름"
                value={userData.name}
                onChange={handleChange}
                error={errors.name}
              />
            </div>
            
            <div className="form-group">
              <Input
                type="email"
                name="email"
                placeholder="이메일"
                value={userData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            
            <div className="form-group">
              <Input
                type="password"
                name="password"
                placeholder="비밀번호"
                value={userData.password}
                onChange={handleChange}
                error={errors.password}
              />
            </div>
            
            <div className="form-group">
              <Input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호 확인"
                value={userData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? '가입 중...' : '회원가입'}
            </Button>
          </form>
          
          <div className="auth-links">
            <p>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 