import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import ProfileEditPage from './routes/ProfileEditPage';
import ProfilePage from './routes/ProfilePage';
import PlannerPageV2 from './routes/PlannerPageV2';
import DashboardEditPage from './routes/DashboardEditPage';
import DashboardPage from './routes/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { AcademicDataProvider } from './context/AcademicDataContext';
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
    element: (
    <ProtectedRoute>
      <ProfileEditPage />
    </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/planner",
    element: (
      <ProtectedRoute>
        <PlannerPageV2 />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard/edit",
    element: (
    <ProtectedRoute>
      <DashboardEditPage />
    </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AcademicDataProvider>
      <RouterProvider router={router} />
    </AcademicDataProvider>
  </AuthProvider>
)
