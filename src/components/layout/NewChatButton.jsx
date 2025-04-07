import { Plus } from 'lucide-react';

export default function NewChatButton() {
  const handleNewChat = () => {
    // TODO: 새로운 채팅 생성 로직 연결
    console.log("새 채팅 시작!");
  };

  return (
    <button
      onClick={handleNewChat}
      className="flex items-center gap-2 px-4 py-3 hover:bg-zinc-800 transition w-full text-left border-b border-zinc-800"
    >
      <Plus className="w-4 h-4" />
      새 채팅
    </button>
  );
}
