import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Routes from './routes';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Routes />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
