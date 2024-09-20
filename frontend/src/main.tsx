import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import ProfileEditPage from './routes/ProfileEditPage';
import ProfilePage from './routes/ProfilePage';
import PlannerPage from './routes/PlannerPage';
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
    path: "/profile/edit",
    element: <ProfileEditPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/planner",
    element: <PlannerPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
