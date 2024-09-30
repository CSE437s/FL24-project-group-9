import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import LoginPage from './routes/LoginPage';
import HomePage from './routes/HomePage';
import ProfileEditPage from './routes/ProfileEditPage';
import ProfilePage from './routes/ProfilePage';
import PlannerPage from './routes/PlannerPage';
import DashboardPage from './routes/DashboardPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
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
        <PlannerPage />
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
    <RouterProvider router={router} />
  </AuthProvider>
)
