import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthListener } from './hooks/useAuth'
import ProtectedRoute from './components/layout/ProtectedRoute'
import PublicRoute from './components/layout/PublicRoute'
import Toaster from './components/ui/Toaster'

const LoginPage          = lazy(() => import('./pages/LoginPage'))
const RegisterPage       = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage  = lazy(() => import('./pages/ResetPasswordPage'))
const CatalogPage        = lazy(() => import('./pages/CatalogPage'))
const ProductsAdminPage  = lazy(() => import('./pages/ProductsAdminPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function AppRoutes() {
  useAuthListener()

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login"              element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/registro"           element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/recuperar-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/nueva-password"     element={<ResetPasswordPage />} />
        <Route path="/"                   element={<ProtectedRoute><CatalogPage /></ProtectedRoute>} />
        <Route path="/productos"          element={<ProtectedRoute><ProductsAdminPage /></ProtectedRoute>} />
        <Route path="*"                   element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <Toaster />
    </BrowserRouter>
  )
}
