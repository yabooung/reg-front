import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import PrivateRoute from './components/common/PrivateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute><ChatPage /></PrivateRoute>,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/history',
    element: <PrivateRoute><HistoryPage /></PrivateRoute>,
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes; 