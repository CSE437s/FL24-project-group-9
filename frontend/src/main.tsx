import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AcademicDataProvider } from './context/AcademicDataContext'
import { AuthProvider } from './context/AuthContext'
import { StudentProvider } from './context/StudentContext'
import DashboardEditPage from './routes/DashboardEditPage'
import DashboardPage from './routes/DashboardPage'
import HomePage from './routes/HomePage'
import LoginPage from './routes/LoginPage'
import OnboardingPage from './routes/OnboardingPage'
import PlannerPageV2 from './routes/PlannerPageV2'
import ProfileEditPage from './routes/ProfileEditPage'
import ProfilePage from './routes/ProfilePage'
import ProtectedRoute from './routes/ProtectedRoute'

import './index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/profile/edit',
    element: (
      <ProtectedRoute>
        <ProfileEditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/planner',
    element: (
      <ProtectedRoute>
        <PlannerPageV2 />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard/edit',
    element: (
      <ProtectedRoute>
        <DashboardEditPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
])

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <AcademicDataProvider>
      <StudentProvider>
        <RouterProvider router={router} />
      </StudentProvider>
    </AcademicDataProvider>
  </AuthProvider>
)
