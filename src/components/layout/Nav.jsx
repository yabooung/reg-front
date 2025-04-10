import React from 'react';

const Nav = ({ onOpenModelSettings, onOpenPromptSettings }) => {
  return (
    <nav className="bg-white border-b border-gray-200 h-14 flex items-center px-6 flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <div className="font-bold text-xl text-blue-600">규제 정보 검색</div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onOpenPromptSettings}
            className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            프롬프트
          </button>
          <button
            onClick={onOpenModelSettings}
            className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            모델 설정
          </button>
          <button className="px-4 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors text-sm">
            도움말
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <span className="text-sm font-semibold">U</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav; 