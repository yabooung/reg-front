import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>법률 챗봇</h2>
            <p>법률 상담을 위한 AI 챗봇 서비스</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-section">
              <h3>서비스</h3>
              <ul>
                <li><a href="/">홈</a></li>
                <li><a href="/about">소개</a></li>
                <li><a href="/pricing">요금제</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>지원</h3>
              <ul>
                <li><a href="/faq">자주 묻는 질문</a></li>
                <li><a href="/contact">문의하기</a></li>
                <li><a href="/privacy">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} 법률 챗봇. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 