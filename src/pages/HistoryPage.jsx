import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConversationHistory } from '../api/chat';
import Header from '../components/layout/Header';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getConversationHistory();
        setHistory(data);
      } catch (err) {
        setError('대화 기록을 불러오는데 실패했습니다.');
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="history-page">
      <Header />
      <div className="container">
        <h1>대화 기록</h1>
        
        {loading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : history.length === 0 ? (
          <div className="empty-history">
            <p>대화 기록이 없습니다.</p>
            <Link to="/" className="start-chat-btn">새 대화 시작하기</Link>
          </div>
        ) : (
          <ul className="history-list">
            {history.map((conversation) => (
              <li key={conversation.id} className="history-item">
                <Link to={`/?conversation=${conversation.id}`}>
                  <div className="conversation-title">
                    {conversation.title || '제목 없음'}
                  </div>
                  <div className="conversation-date">
                    {formatDate(conversation.createdAt)}
                  </div>
                  <div className="conversation-preview">
                    {conversation.preview || '내용 없음'}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage; 