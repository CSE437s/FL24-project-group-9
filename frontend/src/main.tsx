import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { AcademicDataProvider } from './context/AcademicDataContext'
import { AuthProvider } from './context/AuthContext'
import { StudentProvider } from './context/StudentContext'
import CoursePage from './routes/CoursePage'
import DashboardEditPage from './routes/DashboardEditPage'
import DashboardPage from './routes/DashboardPage'
import ForgotPasswordPage from './routes/ForgotPasswordPage'
import HomePage from './routes/HomePage'
import LoginPage from './routes/LoginPage'
import OnboardingPage from './routes/OnboardingPage'
import PlannerPage from './routes/PlannerPage'
import ProfileEditPage from './routes/ProfileEditPage'
import ProtectedRoute from './routes/ProtectedRoute'
import ResetPasswordPage from './routes/ResetPasswordPage'
import VerifyEmailPage from './routes/VerifyEmailPage'

import 'bootstrap/dist/css/bootstrap.min.css'
import './theme.scss'
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
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
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
    path: '/planner',
    element: (
      <ProtectedRoute>
        <PlannerPage />
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
    path: '/course/:courseId',
    element: (
      <ProtectedRoute>
        <CoursePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/verify_email/:uid/:token',
    element: <VerifyEmailPage />,
  },
  {
    path: '/reset_password/:uid/:token',
    element: <ResetPasswordPage />,
  },
  {
    path: '/forgot_password',
    element: <ForgotPasswordPage />,
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
