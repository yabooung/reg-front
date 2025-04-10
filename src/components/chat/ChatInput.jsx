import React from 'react';

const ChatInput = ({ message, setMessage }) => {
  return (
    <div className="fixed bottom-0 left-64 right-0 p-4 bg-[#343541]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center bg-[#40414F] rounded-lg p-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="규제 관련 질문을 입력하세요..."
            className="flex-1 bg-transparent border-0 outline-none text-white px-3 py-2"
          />
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">
          Reg Navigator는 규제 정보 검색 및 분석을 위한 AI 도구입니다.
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 