import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { SettingsProvider } from './context/SettingsContext';
import Routes from './routes';
import './styles/global.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <SettingsProvider>
          <Routes />
        </SettingsProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
