import React, { useState } from 'react';

const ModelSettings = ({ onClose, onSave }) => {
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  
  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: '가장 강력한 모델로 복잡한 규제 분석에 적합' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: '빠른 응답과 간단한 규제 검색에 적합' },
    { id: 'legal-gpt', name: 'Legal GPT (Beta)', description: '법적 규제에 특화된 모델' },
  ];

  const handleSave = () => {
    if (onSave) {
      onSave({
        model: selectedModel,
        temperature,
        maxTokens
      });
    }
    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">모델 설정</h2>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">AI 모델 선택</label>
        <div className="space-y-3">
          {models.map(model => (
            <div 
              key={model.id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedModel === model.id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 ${
                  selectedModel === model.id 
                    ? 'bg-blue-500' 
                    : 'border border-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-500">{model.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          Temperature: {temperature.toFixed(1)}
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500 text-sm">정확함</span>
          <input 
            type="range" 
            min="0" 
            max="2" 
            step="0.1" 
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-gray-500 text-sm">창의성</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          낮은 값은 더 결정적인 응답을, 높은 값은 더 다양한 응답을 생성합니다.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">
          최대 토큰 수: {maxTokens}
        </label>
        <input 
          type="range" 
          min="500" 
          max="8000" 
          step="100" 
          value={maxTokens}
          onChange={(e) => setMaxTokens(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <p className="text-xs text-gray-500 mt-1">
          응답 생성에 사용할 최대 토큰 수를 설정합니다. (약 750단어 = 1000토큰)
        </p>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 rounded-md text-white hover:bg-blue-600"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default ModelSettings; 