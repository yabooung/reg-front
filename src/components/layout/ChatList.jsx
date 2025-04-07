import ChatListItem from './ChatListItem';

const dummyChats = [
  { id: 1, title: '민법 질문', updatedAt: '5분 전' },
  { id: 2, title: '상속 관련 상담', updatedAt: '어제' },
];

export default function ChatList() {
  return (
    <div className="flex-1 overflow-y-auto">
      {dummyChats.map((chat) => (
        <ChatListItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
