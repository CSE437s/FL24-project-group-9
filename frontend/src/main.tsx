import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import ProfilePage from './routes/ProfilePage';
import SchedulerPage from './routes/SchedulerPage';
import DashboardPage from './routes/DashboardPage';
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/scheduler",
    element: <SchedulerPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
