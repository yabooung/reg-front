import React from 'react';

const NewChatButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full border border-gray-200 rounded-md p-3 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4v16m8-8H4" 
        />
      </svg>
      <span className="text-base">새 규제 검색</span>
    </button>
  );
};

export default NewChatButton;
