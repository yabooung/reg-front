export default function ChatListItem({ chat }) {
    const handleClick = () => {
      // TODO: 해당 채팅으로 이동
      console.log(`채팅 ${chat.id} 선택됨`);
    };
  
    return (
      <div
        onClick={handleClick}
        className="px-4 py-2 hover:bg-zinc-800 cursor-pointer"
      >
        <div className="text-sm truncate">{chat.title}</div>
        <div className="text-xs text-zinc-400">{chat.updatedAt}</div>
      </div>
    );
  }
  