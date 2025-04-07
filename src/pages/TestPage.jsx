import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ChatInput from '../components/chat/ChatInput';
import ChatMessage from '../components/chat/ChatMessage';

const TestPage = () => {
  const [testState, setTestState] = useState({
    inputValue: '',
    buttonClicked: false,
    counter: 0,
    chatMessage: ''
  });

  const handleInputChange = (e) => {
    setTestState({
      ...testState,
      inputValue: e.target.value
    });
  };

  const handleButtonClick = () => {
    setTestState({
      ...testState,
      buttonClicked: true,
      counter: testState.counter + 1
    });
  };

  const handleSendMessage = (message) => {
    console.log('메시지 전송:', message);
    // 테스트용 메시지 상태 업데이트
    setTestState({
      ...testState,
      chatMessage: message
    });
  };

  // 테스트용 메시지 객체
  const testUserMessage = {
    id: '1',
    content: '안녕하세요, 법률 질문이 있습니다.',
    sender: 'user',
    timestamp: new Date().toISOString()
  };

  const testBotMessage = {
    id: '2',
    content: '안녕하세요! 어떤 법률 문제에 대해 도움이 필요하신가요?',
    sender: 'bot',
    timestamp: new Date().toISOString()
  };

  return (
    <div className="flex h-screen bg-gray-100" >
      <Sidebar />
      
      <div className="container py-8">
        <Header />
        <h1 className="text-3xl font-bold mb-6">테스트 페이지</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">컴포넌트 테스트</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">버튼 컴포넌트</h3>
            <div className="flex flex-wrap gap-4">
              <Button>기본 버튼</Button>
              <Button variant="secondary">보조 버튼</Button>
              <Button variant="outline">아웃라인 버튼</Button>
              <Button variant="danger">위험 버튼</Button>
              <Button disabled>비활성화 버튼</Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">입력 컴포넌트</h3>
            <Input
              placeholder="여기에 입력하세요"
              value={testState.inputValue}
              onChange={handleInputChange}
            />
            <Input
              placeholder="에러 상태"
              error="이 필드는 필수입니다"
            />
            <Input
              placeholder="비활성화 상태"
              disabled
            />
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">상태 테스트</h3>
            <p className="mb-2">입력값: {testState.inputValue || '(없음)'}</p>
            <p className="mb-2">버튼 클릭 상태: {testState.buttonClicked ? '클릭됨' : '클릭되지 않음'}</p>
            <p className="mb-2">카운터: {testState.counter}</p>
            <Button onClick={handleButtonClick} className="mt-2">
              카운터 증가
            </Button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">레이아웃 테스트</h2>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-8" style={{ height: '600px' }}>
            <div className="flex h-full bg-gray-50">
              {/* 사이드바 */}
              <aside className="w-64 bg-white border-r border-gray-200 h-full hidden md:block">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-lg">사이드바</h3>
                </div>
                <nav className="p-4">
                  <ul className="space-y-2">
                    <li><a href="#" className="block p-2 rounded hover:bg-gray-100">새 대화</a></li>
                    <li><a href="#" className="block p-2 rounded hover:bg-gray-100">대화 기록</a></li>
                    <li><a href="#" className="block p-2 rounded hover:bg-gray-100">설정</a></li>
                  </ul>
                </nav>
              </aside>

              {/* 메인 채팅 영역 */}
              <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 헤더 */}
                <header className="h-16 border-b border-gray-200 flex items-center px-4">
                  <h3 className="font-medium">법률 상담 채팅</h3>
                  <div className="ml-auto">
                    <Button size="small" variant="outline">새 대화</Button>
                  </div>
                </header>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                  <ChatMessage message={testUserMessage} isUser={true} />
                  <ChatMessage message={testBotMessage} isUser={false} />
                  {testState.chatMessage && (
                    <ChatMessage 
                      message={{
                        id: '3',
                        content: testState.chatMessage,
                        sender: 'user',
                        timestamp: new Date().toISOString()
                      }} 
                      isUser={true} 
                    />
                  )}
                </div>

                {/* 입력 영역 */}
                <div className="border-t border-gray-200 p-4">
                  <ChatInput onSendMessage={handleSendMessage} />
                </div>
              </main>
            </div>
          </div>
          
          {/* 모바일 레이아웃 테스트 */}
          <h3 className="text-lg font-medium mb-4">모바일 레이아웃 (좁은 화면)</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '500px', maxWidth: '375px' }}>
            <div className="flex h-full bg-gray-50">
              {/* 모바일에서는 사이드바 숨김 */}
              
              {/* 메인 채팅 영역 */}
              <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* 헤더 */}
                <header className="h-16 border-b border-gray-200 flex items-center px-4">
                  <button className="mr-2 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <h3 className="font-medium">법률 상담 채팅</h3>
                </header>

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                  <ChatMessage message={testUserMessage} isUser={true} />
                  <ChatMessage message={testBotMessage} isUser={false} />
                </div>

                {/* 입력 영역 */}
                <div className="border-t border-gray-200 p-4">
                  <ChatInput onSendMessage={handleSendMessage} />
                </div>
              </main>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">스타일 테스트</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-100 p-4 rounded">Box 1</div>
            <div className="bg-green-100 p-4 rounded">Box 2</div>
            <div className="bg-yellow-100 p-4 rounded">Box 3</div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-purple-100 p-4 rounded">Flex 1</div>
            <div className="flex-1 bg-pink-100 p-4 rounded">Flex 2</div>
          </div>
        </div>
      <Footer />
      </div>
      
    </div>
  );
};

export default TestPage;
