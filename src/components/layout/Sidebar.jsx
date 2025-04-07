import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>메뉴</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/" className="sidebar-link">
              <span className="sidebar-icon">💬</span>
              <span>새 대화</span>
            </Link>
          </li>
          <li>
            <Link to="/history" className="sidebar-link">
              <span className="sidebar-icon">📚</span>
              <span>대화 기록</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <p>© 2024 법률 챗봇</p>
      </div>
    </aside>
  );
};

export default Sidebar; 