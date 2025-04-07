import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link to="/">
              <h1>법률 챗봇</h1>
            </Link>
          </div>
          
          <nav className="nav">
            {isAuthenticated ? (
              <>
                <Link to="/" className="nav-link">채팅</Link>
                <Link to="/history" className="nav-link">대화 기록</Link>
                <div className="user-menu">
                  <span className="user-name">{user?.name || '사용자'}</span>
                  <button onClick={handleLogout} className="logout-btn">로그아웃</button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">로그인</Link>
                <Link to="/register" className="nav-link">회원가입</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 