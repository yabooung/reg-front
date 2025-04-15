import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { X, Info, Send, Zap } from 'lucide-react';

const ApiSettingsPanel = ({ 
  onReset,
  onClose,
  isOpen
}) => {
  const { 
    useSimpleQuery,
    toggleSimpleQuery,
    apiOptions,
    handleApiOptionChange
  } = useSettings();

  return (
    <>
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800">API 설정</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto h-full pb-32">
          <div className="space-y-5">
            {/* 쿼리만 전송 모드 토글 스위치 */}
            <div className="flex items-center justify-between p-3 border rounded-lg border-gray-200 bg-gray-50 h-16">
              <div className="flex-grow">
                <div className="font-medium text-gray-800">쿼리만 전송 모드</div>
                <div className="text-xs text-gray-500 mt-1">모든 고급 처리 단계를 건너뜁니다</div>
              </div>
              <div className="flex-shrink-0 w-11 ml-2">
                <button
                  onClick={toggleSimpleQuery}
                  className="relative inline-flex items-center h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  style={{ backgroundColor: useSimpleQuery ? '#10a37f' : '#e5e7eb' }}
                >
                  {/* 왼쪽 아이콘 */}
                  <span className="absolute left-0.5 flex items-center justify-center z-10">
                    <Send size={10} className={`text-white transition-opacity duration-200 ${useSimpleQuery ? 'opacity-100' : 'opacity-0'}`} />
                  </span>
                  
                  {/* 오른쪽 아이콘 */}
                  <span className="absolute right-0.5 flex items-center justify-center z-10">
                    <Zap size={10} className={`text-gray-600 transition-opacity duration-200 ${useSimpleQuery ? 'opacity-0' : 'opacity-100'}`} />
                  </span>
                  
                  {/* 움직이는 흰색 원 */}
                  <span
                    className="pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                    style={{ transform: useSimpleQuery ? 'translateX(18px)' : 'translateX(0)' }}
                  />
                </button>
              </div>
            </div>

            {useSimpleQuery ? (
              <div className="rounded-md bg-blue-50 p-3 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm text-blue-700 font-medium">쿼리만 전송 모드가 활성화되었습니다</p>
                    <p className="text-xs text-blue-600 mt-1">다음 설정이 자동으로 비활성화됩니다:</p>
                    <ul className="list-disc list-inside text-xs text-blue-600 mt-1 space-y-0.5">
                      <li>API 모델 설정</li>
                      <li>질문 분류 단계</li>
                      <li>질문 확장 단계</li>
                      <li>응답 검증 단계</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
            
            <div className={useSimpleQuery ? "opacity-50 pointer-events-none" : ""}>
              {/* 모델 선택 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">모델</label>
                <select 
                  name="modelName" 
                  value={apiOptions.modelName}
                  onChange={handleApiOptionChange}
                  disabled={useSimpleQuery}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
                >
                  <option value="gpt-4o-mini">GPT-4o-mini</option>
                  <option value="gpt-4o">GPT-4o</option>
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                </select>
              </div>
              
              {/* Temperature 설정 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Temperature: {apiOptions.temperature}
                </label>
                <input 
                  type="range" 
                  name="temperature"
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={apiOptions.temperature}
                  onChange={handleApiOptionChange}
                  disabled={useSimpleQuery}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>정확성</span>
                  <span>창의성</span>
                </div>
              </div>
              
              {/* 최대 토큰 수 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  최대 토큰 수
                </label>
                <input 
                  type="number" 
                  name="maxTokens"
                  min="100" 
                  max="2000"
                  step="50"
                  value={apiOptions.maxTokens}
                  onChange={handleApiOptionChange}
                  disabled={useSimpleQuery}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
                />
              </div>
              
              {/* 인용 문서 수 */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  인용 문서 수 (Top K)
                </label>
                <input 
                  type="number" 
                  name="topK"
                  min="1" 
                  max="20"
                  value={apiOptions.topK}
                  onChange={handleApiOptionChange}
                  disabled={useSimpleQuery}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#10a37f] focus:border-transparent"
                />
              </div>
              
              {/* 체크박스 옵션들 */}
              <div className="space-y-3 mb-5">
                <h3 className="font-medium text-gray-700 mb-2">처리 단계 설정</h3>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableClassification"
                    name="enableClassification"
                    checked={apiOptions.enableClassification}
                    onChange={handleApiOptionChange}
                    disabled={useSimpleQuery}
                    className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                  />
                  <label htmlFor="enableClassification" className="ml-2 block text-sm text-gray-700">
                    질문 분류 활성화
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableAmplification"
                    name="enableAmplification"
                    checked={apiOptions.enableAmplification}
                    onChange={handleApiOptionChange}
                    disabled={useSimpleQuery}
                    className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                  />
                  <label htmlFor="enableAmplification" className="ml-2 block text-sm text-gray-700">
                    질문 확장 활성화
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="enableValidation"
                    name="enableValidation"
                    checked={apiOptions.enableValidation}
                    onChange={handleApiOptionChange}
                    disabled={useSimpleQuery}
                    className="h-4 w-4 text-[#10a37f] focus:ring-[#10a37f] rounded"
                  />
                  <label htmlFor="enableValidation" className="ml-2 block text-sm text-gray-700">
                    응답 검증 활성화
                  </label>
                </div>
              </div>
            </div>
            
            {/* 초기화 버튼 */}
            <div className="pt-3">
              <button
                onClick={onReset}
                className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-md border border-gray-300 transition-colors"
              >
                기본값으로 초기화
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* 외부 클릭 시 닫기 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40" 
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default ApiSettingsPanel; 