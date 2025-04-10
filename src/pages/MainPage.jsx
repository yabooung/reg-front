import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-[#343541]">
      {/* 사이드바 */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#202123] p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-xl font-semibold">Reg Navigator</h1>
        </div>
        <button className="w-full border border-white/20 rounded-md p-3 text-white hover:bg-gray-700 transition-colors mb-4">
          새 규제 검색
        </button>
        <div className="border-t border-gray-700 pt-4">
          <div className="text-gray-300 text-sm mb-2">이전 검색 기록</div>
          <div className="space-y-2">
            <div className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              금융 규제 검색
            </div>
            <div className="text-gray-300 hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              환경 규제 분석
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="pl-64">
        <main className="container mx-auto p-4 min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col justify-center items-center mb-32">
            <h2 className="text-4xl font-bold text-white mb-8">
              규제 정보 AI 어시스턴트
            </h2>
            <div className="max-w-3xl w-full space-y-4">
              <div className="bg-[#444654] p-4 rounded-lg">
                <div className="text-white">
                  다음과 같은 질문을 해보세요:
                </div>
                <div className="mt-4 space-y-2">
                  <div className="text-gray-300 hover:bg-[#40414F] p-2 rounded cursor-pointer">
                    "최근 개정된 금융 규제를 알려주세요"
                  </div>
                  <div className="text-gray-300 hover:bg-[#40414F] p-2 rounded cursor-pointer">
                    "환경 규제 관련 주요 변경사항을 분석해주세요"
                  </div>
                  <div className="text-gray-300 hover:bg-[#40414F] p-2 rounded cursor-pointer">
                    "우리 회사에 적용되는 규제를 찾아주세요"
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
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
        </main>
      </div>
    </div>
  );
};

export default MainPage; 