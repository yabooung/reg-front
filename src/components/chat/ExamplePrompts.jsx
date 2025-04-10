import React from 'react';

const ExamplePrompts = ({ onExampleClick }) => {
  const examples = [
    '최근 개정된 금융 규제 알려줘',
    '개인정보보호법 주요 조항 설명해줘',
    '환경 영향 평가법 의무 대상은?',
    '디지털 자산 기본법 시행 일정이 어떻게 되나요?'
  ];

  const handleClick = (example) => {
    if (onExampleClick) {
      onExampleClick(example);
    }
    console.log('Example clicked:', example);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {examples.map((example, index) => (
        <button
          key={index}
          onClick={() => handleClick(example)}
          className="flex items-center text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors bg-white text-gray-700 shadow-sm hover:shadow"
        >
          <div className="w-6 h-6 rounded-full bg-[#eff5f1] flex items-center justify-center mr-3 text-[#10a37f]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm">{example}</span>
        </button>
      ))}
    </div>
  );
};

export default ExamplePrompts; 