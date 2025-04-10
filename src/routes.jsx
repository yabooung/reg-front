import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HistoryPage from './pages/HistoryPage';
import TestPage from './pages/TestPage';
import PrivateRoute from './components/common/PrivateRoute';
import MainPage from './pages/MainPage';
import LayoutTest from './pages/LayoutTest';

const Routes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainPage />,
    },
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
    {
      path: '/test',
      element: <TestPage />,
    },
    {
      path: '/layout-test',
      element: <LayoutTest />,
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Routes; 